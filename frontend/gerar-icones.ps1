Add-Type -AssemblyName System.Drawing

$srcFile = "C:\Users\Tino Eduardo\Desktop\MEET-US\frontend\MEET-US.png"
$bytes = [System.IO.File]::ReadAllBytes($srcFile)
$msSrc = New-Object System.IO.MemoryStream(,$bytes)
$src = [System.Drawing.Bitmap]::FromStream($msSrc)

# Emblem bounding box: X=214, Y=138, W=454, H=454
$rectEmb = New-Object System.Drawing.Rectangle(214, 138, 454, 454)
$rawEmblem = $src.Clone($rectEmb, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

function Save-BmpAsPng($bmp, $filePath) {
    if (Test-Path -LiteralPath $filePath) {
        Remove-Item -LiteralPath $filePath -Force
    }
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    [System.IO.File]::WriteAllBytes($filePath, $ms.ToArray())
    $ms.Dispose()
}

function Resize-Image($sourceBmp, $targetW, $targetH, $padPercent) {
    $targetBmp = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($targetBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::White)

    $pad = [int]($targetW * $padPercent)
    $destW = $targetW - (2 * $pad)
    $destH = $targetH - (2 * $pad)
    $destRect = New-Object System.Drawing.Rectangle($pad, $pad, $destW, $destH)
    $g.DrawImage($sourceBmp, $destRect)
    $g.Dispose()
    return $targetBmp
}

$sizes = @(
    @{ File="icon-512x512.png"; W=512; H=512; Pad=0.06 },
    @{ File="icon-384x384.png"; W=384; H=384; Pad=0.06 },
    @{ File="icon-256x256.png"; W=256; H=256; Pad=0.06 },
    @{ File="icon-192x192.png"; W=192; H=192; Pad=0.06 },
    @{ File="icon-128x128.png"; W=128; H=128; Pad=0.06 },
    @{ File="icon-maskable-512x512.png"; W=512; H=512; Pad=0.14 },
    @{ File="icon-monochrome-512x512.png"; W=512; H=512; Pad=0.06 },
    @{ File="apple-icon-180x180.png"; W=180; H=180; Pad=0.06 },
    @{ File="apple-icon-167x167.png"; W=167; H=167; Pad=0.06 },
    @{ File="apple-icon-152x152.png"; W=152; H=152; Pad=0.06 },
    @{ File="apple-icon-120x120.png"; W=120; H=120; Pad=0.06 },
    @{ File="favicon-128x128.png"; W=128; H=128; Pad=0.04 },
    @{ File="favicon-96x96.png"; W=96; H=96; Pad=0.04 },
    @{ File="favicon-32x32.png"; W=32; H=32; Pad=0.02 },
    @{ File="favicon-16x16.png"; W=16; H=16; Pad=0.02 },
    @{ File="meet-us-symbol.png"; W=512; H=512; Pad=0.02 }
)

$iconsDir = "C:\Users\Tino Eduardo\Desktop\MEET-US\frontend\public\icons"
foreach ($s in $sizes) {
    $outBmp = Resize-Image $rawEmblem $s.W $s.H $s.Pad
    $outPath = Join-Path $iconsDir $s.File
    Save-BmpAsPng $outBmp $outPath
    $outBmp.Dispose()
    Write-Output "OK: $($s.File)"
}

$electronAssets = "C:\Users\Tino Eduardo\Desktop\MEET-US\frontend\src-electron\electron-assets"
$electronPng = Resize-Image $rawEmblem 512 512 0.05
Save-BmpAsPng $electronPng (Join-Path $electronAssets "icon.png")
$electronPng.Dispose()

# Horizontal logo
$rectFull = New-Object System.Drawing.Rectangle(200, 120, 1830, 480)
$fullLogo = $src.Clone($rectFull, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
Save-BmpAsPng $fullLogo (Join-Path $iconsDir "meet-us-logo.png")
Save-BmpAsPng $fullLogo "C:\Users\Tino Eduardo\Desktop\MEET-US\frontend\public\images\meet-us-logo.png"
Save-BmpAsPng $fullLogo "C:\Users\Tino Eduardo\Desktop\MEET-US\frontend\public\meet-us-logo.png"
$fullLogo.Dispose()

# Favicon.ico
$icoBmp = Resize-Image $rawEmblem 48 48 0.04
$hIcon = $icoBmp.GetHicon()
$iconObj = [System.Drawing.Icon]::FromHandle($hIcon)

$icoPath1 = "C:\Users\Tino Eduardo\Desktop\MEET-US\frontend\public\favicon.ico"
if (Test-Path -LiteralPath $icoPath1) { Remove-Item -LiteralPath $icoPath1 -Force }
$icoStream1 = [System.IO.File]::OpenWrite($icoPath1)
$iconObj.Save($icoStream1)
$icoStream1.Close()

$icoPath2 = Join-Path $electronAssets "icon.ico"
if (Test-Path -LiteralPath $icoPath2) { Remove-Item -LiteralPath $icoPath2 -Force }
$icoStream2 = [System.IO.File]::OpenWrite($icoPath2)
$iconObj.Save($icoStream2)
$icoStream2.Close()

$icoBmp.Dispose()
$rawEmblem.Dispose()
$src.Dispose()
$msSrc.Dispose()
Write-Output "SUCCESS: All Quasar icons replaced with MEET-US logo!"
