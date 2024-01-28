import zipfile

print("[All] Started Building Extension")

files_global = [
    "./dash/bootstrap.min.css",
    "./dash/bootstrap.js",

    "./dash.html",

    "./resources/dyslexia.woff",

    "./icon_128.png",
    "./icon_500.png",
]

files_chromium = [
    "./dash/apPlugin.js",

    "./resources/ap-font-import.css",

    "./background.js",
    "./manifest.json"
]

files_gekko = [
    "./firefox_only/dash/apPlugin.js",

    "./firefox_only/resources/ap-font-import.css",

    "./firefox_only/background.js",
    "./firefox_only/manifest.json"
]

print("[Chromium] Creating ZIP File")
chromium = zipfile.ZipFile('accessibilityPlus_EdgeChrome.zip', 'w')
print("[FireFox] Creating ZIP File")
firefox = zipfile.ZipFile('accessibilityPlus_FireFox.zip', 'w')
with chromium as container:
    for file in (files_global + files_chromium):
        print("[Chromium] Writing", file)
        container.write(file)
print("[Chromium] Closing ZIP File")
chromium.close()
with firefox as container:
    for file in (files_global + files_gekko):
        print("[FireFox] Writing", file)
        container.write(file, arcname = file.replace("firefox_only/", ""))
print("[FireFox] Closing ZIP File")
firefox.close()

print("[All] Finished Building Extension")
