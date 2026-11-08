// frontend/src/services/upload.service.js
export const uploadService = {
  /**
   * Converte um ficheiro selecionado localmente em Data URL Base64 para persistência local
   * @param {File} file
   * @returns {Promise<string>}
   */
  async uploadLocal(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }
}
