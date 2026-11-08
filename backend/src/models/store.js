// backend/src/models/store.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.resolve(__dirname, '../../.data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

class Query {
  constructor(collection, items) {
    this.collection = collection;
    this.items = [...items];
  }

  sort(sortCriteria) {
    if (!sortCriteria) return this;
    const entries = Object.entries(sortCriteria);
    this.items.sort((a, b) => {
      for (const [key, dir] of entries) {
        let valA = a[key];
        let valB = b[key];
        if (valA === undefined) valA = 0;
        if (valB === undefined) valB = 0;
        if (valA < valB) return dir === 1 || dir === 'asc' ? -1 : 1;
        if (valA > valB) return dir === 1 || dir === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return this;
  }

  skip(n) {
    this.items = this.items.slice(n);
    return this;
  }

  limit(n) {
    this.items = this.items.slice(0, n);
    return this;
  }

  lean() {
    return this;
  }

  populate() {
    return this;
  }

  async exec() {
    return this.items.map(item => this.collection._wrap(item));
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

class Document {
  constructor(data, collection) {
    Object.assign(this, data);
    this._id = data._id ? String(data._id) : generateId();
    this.id = this._id;
    this._collection = collection;
  }

  async comparePassword(candidatePassword) {
    if (!this.password) return false;
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
      return bcrypt.compare(candidatePassword, this.password);
    }
    return this.password === candidatePassword;
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    return this._collection._updateDoc(this);
  }

  toJSON() {
    const obj = { ...this };
    delete obj._collection;
    obj.id = String(this._id);
    return obj;
  }

  toObject() {
    return this.toJSON();
  }
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this.data = this._load();
  }

  _load() {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(raw);
      } catch (e) {
        console.error(`[Store] Error loading ${this.filePath}:`, e);
        return [];
      }
    }
    return [];
  }

  _save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error(`[Store] Error saving ${this.filePath}:`, e);
    }
  }

  _wrap(raw) {
    if (!raw) return null;
    return new Document(raw, this);
  }

  _updateDoc(doc) {
    const idx = this.data.findIndex(d => String(d._id) === String(doc._id) || String(d.id) === String(doc._id));
    const clean = doc.toJSON();
    if (idx >= 0) {
      this.data[idx] = clean;
    } else {
      this.data.push(clean);
    }
    this._save();
    return doc;
  }

  _matches(item, query = {}) {
    if (!query || Object.keys(query).length === 0) return true;

    for (const [key, val] of Object.entries(query)) {
      if (key === '$or' && Array.isArray(val)) {
        const anyMatch = val.some(subQuery => this._matches(item, subQuery));
        if (!anyMatch) return false;
        continue;
      }
      if (key === '_id' || key === 'id') {
        const itemId = String(item._id || item.id);
        const queryId = String(val);
        if (itemId !== queryId) return false;
        continue;
      }

      const itemVal = item[key];

      if (val && typeof val === 'object' && !Array.isArray(val)) {
        if ('$ne' in val && itemVal === val.$ne) return false;
        if ('$in' in val && Array.isArray(val.$in) && !val.$in.map(String).includes(String(itemVal))) return false;
        if ('$nin' in val && Array.isArray(val.$nin) && val.$nin.map(String).includes(String(itemVal))) return false;
        if ('$regex' in val) {
          const re = new RegExp(val.$regex, val.$options || 'i');
          if (!re.test(String(itemVal || ''))) return false;
        }
        continue;
      }

      if (itemVal !== val) return false;
    }
    return true;
  }

  find(query = {}) {
    const matched = this.data.filter(item => this._matches(item, query));
    return new Query(this, matched);
  }

  async findOne(query = {}) {
    const item = this.data.find(item => this._matches(item, query));
    return this._wrap(item);
  }

  async findById(id) {
    if (!id) return null;
    const sId = String(id);
    const item = this.data.find(d => String(d._id) === sId || String(d.id) === sId);
    return this._wrap(item);
  }

  async findByIdAndUpdate(id, update, options = {}) {
    let doc = await this.findById(id);
    if (!doc) return null;
    const patch = update.$set ? update.$set : update;
    Object.assign(doc, patch);
    await doc.save();
    return doc;
  }

  async findByIdAndDelete(id) {
    const sId = String(id);
    const idx = this.data.findIndex(d => String(d._id) === sId || String(d.id) === sId);
    if (idx >= 0) {
      const removed = this.data.splice(idx, 1)[0];
      this._save();
      return this._wrap(removed);
    }
    return null;
  }

  async create(docData) {
    const now = new Date().toISOString();
    const id = docData._id ? String(docData._id) : generateId();
    const clean = {
      ...docData,
      _id: id,
      id: id,
      createdAt: docData.createdAt || now,
      updatedAt: docData.updatedAt || now
    };
    this.data.push(clean);
    this._save();
    return this._wrap(clean);
  }

  async countDocuments(query = {}) {
    return this.data.filter(item => this._matches(item, query)).length;
  }

  async deleteOne(query = {}) {
    const idx = this.data.findIndex(item => this._matches(item, query));
    if (idx >= 0) {
      this.data.splice(idx, 1);
      this._save();
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(query = {}) {
    const before = this.data.length;
    this.data = this.data.filter(item => !this._matches(item, query));
    const deletedCount = before - this.data.length;
    if (deletedCount > 0) this._save();
    return { deletedCount };
  }

  async updateMany(query = {}, update = {}) {
    const patch = update.$set ? update.$set : update;
    let modifiedCount = 0;
    this.data.forEach(item => {
      if (this._matches(item, query)) {
        Object.assign(item, patch, { updatedAt: new Date().toISOString() });
        modifiedCount++;
      }
    });
    if (modifiedCount > 0) this._save();
    return { modifiedCount };
  }
}

const collections = {};
function getStoreCollection(name) {
  if (!collections[name]) {
    collections[name] = new Collection(name);
  }
  return collections[name];
}

module.exports = { getStoreCollection, Document };