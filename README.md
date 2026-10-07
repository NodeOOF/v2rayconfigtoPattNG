<div dir="rtl" align="right">

# 🌐 پنل v2rayconfigtoPattNG

### مبدل هوشمند VLESS / Trojan / Shadowsocks برای PattNG

<br>

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-181717?style=for-the-badge&logo=github&logoColor=white)](https://nodeoof.github.io/v2rayconfigtoPattNG/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-3DA639?style=for-the-badge)](LICENSE)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge)](https://github.com/NodeOOF)

<br>

> **پنل تحت وب تک‌صفحه‌ای (SPA)** برای تبدیل لینک‌های V2Ray (VLESS, Trojan, Shadowsocks) به فرمت بهینه‌شده با پارامترهای امنیتی و فرگمنتیشن، مخصوص دور زدن فیلترینگ و DPI.

> 🚀 **خودکار هر ۶ ساعت به‌روزرسانی می‌شود** — بدون نیاز به دخالت شما.

</div>

---

## 📡 لینک اتصال سریع

<div dir="rtl" align="right">

### 🔗 لینک Subscription آماده (آپدیت خودکار):

```
https://raw.githubusercontent.com/NodeOOF/v2rayconfigtoPattNG/refs/heads/main/configs.txt
```

این لینک را کافی است در **V2RayNG**، **PattNG**، **Streisand** یا هر کلاینت دیگری به‌عنوان **Subscription URL** وارد کنید. کانفیگ‌ها هر ۶ ساعت به‌صورت خودکار به‌روزرسانی می‌شوند.

### 🌐 پنل تحت وب:

```
https://nodeoof.github.io/v2rayconfigtoPattNG/
```

</div>

---

## 🎯 چرا این پروژه؟

<div dir="rtl" align="right">

اکثر کانفیگ‌های عمومی V2Ray که در اینترنت پیدا می‌شوند، فاقد پارامترهای ضد-DPI هستند و در ایران به‌سرعت شناسایی و مسدود می‌شوند. این پروژه با اعمال خودکار تنظیمات زیر، شانس اتصال پایدار را **به‌طور چشمگیری افزایش می‌دهد**:

- 🛡️ **Cipher Suites سفارشی (`cs`)** — مقابله با اثرانگشت‌نگاری TLS
- 🧩 **Fragment Method (`fm`)** — تکه‌تکه کردن بسته‌ها برای فرار از DPI
- 🎭 **Fingerprint (`fp=unsafe`)** — جعل هویت مرورگر
- 🌐 **IPv4 → IPv6 Cloudflare** — پشتیبانی از رنج IPv6 کلودفلر

</div>

---

## ✨ ویژگی‌های کلیدی

<div dir="rtl" align="right">

| ویژگی | توضیح |
|---|---|
| 🔄 **تبدیل خودکار** | پارامترهای `cs`، `fm` و `fp` به‌صورت خودکار اعمال می‌شوند |
| 🎯 **پشتیبانی چند پروتکل** | VLESS، Trojan و Shadowsocks |
| 🌍 **IPv4 → IPv6** | آدرس‌های IPv4 کلودفلر به IPv6 در رنج `2606:4700::/32` تبدیل می‌شوند |
| 📝 **نام‌گذاری شماره‌دار** | هر کانفیگ خروجی با الگوی `github.com/NodeOOF - N` |
| 📱 **ارسال مستقیم به PattNG** | با یک کلیک از طریق دیپ‌لینک `v2rayng://` |
| 📋 **کپی هوشمند** | با پشتیبانی از Clipboard API و Fallback |
| 🎨 **رابط کاربری مدرن** | تم تیره، طراحی مهندسی، RTL فارسی |
| 🔒 **بدون سرور** | تمام پردازش‌ها Client-Side |
| ⏰ **آپدیت خودکار** | Cloudflare Worker هر ۶ ساعت کانفیگ‌ها را تازه می‌کند |

</div>

---

## 🏗️ معماری سیستم

<div dir="rtl" align="right">

```
┌─────────────────────────────────────────────────────┐
│ Cloudflare Worker (Cron: هر ۶ ساعت) │
│ ───────────────────────────────────── │
│ 1. Fetch منبع (patterniha/Free-Configs) │
│ 2. تبدیل (IPv4→IPv6, cs/fm/fp, نام‌گذاری) │
│ 3. Push به GitHub via REST API │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ GitHub Repository: NodeOOF/v2rayconfigtoPattNG │
│ ───────────────────────────────────── │
│ ├── index.html ← پنل UI │
│ ├── configs.txt ← خروجی خودکار │
│ └── src/index.js ← کد Worker │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ GitHub Pages (CDN) │
│ https://nodeoof.github.io/v2rayconfigtoPattNG/ │
└─────────────────────────────────────────────────────┘
```

</div>

---

## 📋 پارامترهای اعمال‌شده

<div dir="rtl" align="right">

| پارامتر | مقدار | اعمال روی | توضیح |
|---------|-------|-----------|-------|
| **`cs`** | `TLS_AES_256_GCM_SHA384:...` | VLESS + Trojan | لیست Cipher Suites سفارشی |
| **`fm`** | `{tcp:[fragment,...],udp:[noise,...]}` | همه | Fragment Method دوگانه |
| **`fp`** | `unsafe` | VLESS + Trojan | Fingerprint مرورگر |

### نمونه خروجی:

```
vless://uuid@[2606:4700::bc72:6106]:443?security=tls&type=ws
&host=example.com&path=/ws
&fp=unsafe
&cs=TLS_AES_256_GCM_SHA384%3A...
&fm=%7B%22tcp%22%3A...
#github.com/NodeOOF - 1
```

</div>

---

## 🚀 راه‌اندازی و استفاده

<div dir="rtl" align="right">

### روش ۱: استفاده از پنل آنلاین (ساده‌ترین)

1. به آدرس [پنل](https://nodeoof.github.io/v2rayconfigtoPattNG/) بروید
2. روی دکمه **⬇️ بارگیری از گیت‌هاب** کلیک کنید
3. روی **🚀 تبدیل** بزنید
4. روی **📱 افزودن به PattNG** یا **📋 کپی خروجی** بزنید

### روش ۲: Subscription مستقیم

کافی است این URL را در کلاینت خود وارد کنید:

```
https://raw.githubusercontent.com/NodeOOF/v2rayconfigtoPattNG/refs/heads/main/configs.txt
```

### روش ۳: استفاده محلی

```bash
git clone https://github.com/NodeOOF/v2rayconfigtoPattNG.git
cd v2rayconfigtoPattNG
# فایل index.html را در مرورگر باز کنید
```

</div>

---

## 🔧 نصب و راه‌اندازی Worker (برای توسعه‌دهندگان)

<div dir="rtl" align="right">

### پیش‌نیازها

* Node.js نسخه ۱۸ یا بالاتر
* حساب Cloudflare (پلن رایگان کافی است)
* GitHub Personal Access Token (Fine-grained)

### مراحل

**۱. کلون پروژه:**

```bash
git clone https://github.com/NodeOOF/v2rayconfigtoPattNG.git
cd v2rayconfigtoPattNG
npm install
```

**۲. ساخت GitHub Token:**

به این لینک بروید و توکن بسازید:

| فیلد                   | مقدار                                                  |
| ---------------------- | ------------------------------------------------------ |
| Repository access      | Only select repositories → NodeOOF/v2rayconfigtoPattNG |
| Permissions → Contents | Read and write                                         |

**۳. لاگین به Cloudflare:**

```bash
npx wrangler login
```

**۴. تنظیم Secrets:**

```bash
npx wrangler secret put GITHUB_TOKEN   # توکن GitHub
npx wrangler secret put RUN_TOKEN      # رمز دلخواه برای تست دستی
```

**۵. دیپلوی:**

```bash
npx wrangler deploy
```

**۶. تست دستی:**

```bash
curl "https://YOUR-WORKER.workers.dev/run?token=YOUR_RUN_TOKEN"
```

</div>

---

## 📁 ساختار پروژه

```
v2rayconfigtoPattNG/
├── .github/
│   └── workflows/          # (اختیاری) GitHub Actions
├── preview/
│   └── preview.png         # تصویر پیش‌نمایش
├── src/
│   └── index.js            # کد Cloudflare Worker
├── index.html              # پنل تحت وب (SPA)
├── configs.txt             # خروجی خودکار (توسط Worker)
├── wrangler.toml           # تنظیمات Worker
├── package.json
├── README.md
└── LICENSE
```

---

## ⚙️ تنظیمات Worker (wrangler.toml)

```toml
name = "config-converter-nodeoof"
main = "src/index.js"
compatibility_date = "2024-11-01"

workers_dev = false                    # غیرفعال‌سازی URL عمومی

[triggers]
crons = ["0 */6 * * *"]                # هر ۶ ساعت

[vars]
GITHUB_OWNER  = "NodeOOF"
GITHUB_REPO   = "v2rayconfigtoPattNG"
GITHUB_PATH   = "configs.txt"
GITHUB_BRANCH = "main"
SOURCE_URL    = "https://raw.githubusercontent.com/patterniha/Free-Configs/main/configs.txt"
```

---

## 🧩 جزئیات فنی

<div dir="rtl" align="right">

### تکنولوژی‌ها

| لایه           | تکنولوژی                                  |
| -------------- | ----------------------------------------- |
| Frontend       | HTML5 + CSS3 + Vanilla JS                 |
| Backend (Cron) | Cloudflare Workers                        |
| Fonts          | Vazirmatn + JetBrains Mono (Google Fonts) |
| Hosting        | GitHub Pages + Cloudflare                 |

### الگوریتم تبدیل

```
1. پارس URI → استخراج base, query, hash
2. تشخیص IPv4 در host → تبدیل به IPv6 (2606:4700::/32)
3. پارس query params → Map
4. اعمال cs, fm, fp بر اساس نوع پروتکل
5. نام‌گذاری شماره‌دار
6. بازسازی URI
```

### Endpoints Worker

| Endpoint              | کاربرد           |
| --------------------- | ---------------- |
| GET /                 | صفحه راهنما      |
| GET /run?token=SECRET | اجرای دستی تبدیل |
| GET /status           | وضعیت و متغیرها  |
| GET /favicon.ico      | 204 No Content   |

</div>

---

## ⚠️ محدودیت‌ها

<div dir="rtl" align="right">

* Shadowsocks قدیمی: فقط فرمت SIP002 (با ? و #) پشتیبانی می‌شود
* طول URL: در صورت تبدیل > ۲۰ کانفیگ، Deep-link ممکن است قطع شود
* پارامترهای ثابت: مقادیر cs, fm, fp در کد ثابت هستند
* کش GitHub Pages: تا ۱۰-۱۵ دقیقه تأخیر در آپدیت
* توکن GitHub: نیاز به تمدید دوره‌ای (۹۰ روز)

</div>

---

## 🔒 حریم خصوصی و امنیت

<div dir="rtl" align="right">

* ✅ هیچ داده‌ای به سرور ارسال نمی‌شود — تمام پردازش‌ها Client-Side
* ✅ بدون Analytics یا Tracker
* ✅ توکن GitHub به‌عنوان Secret در Cloudflare ذخیره می‌شود
* ⚠️ کانفیگ‌های عمومی برای اطلاعات حساس توصیه نمی‌شوند
* ⚠️ fp=unsafe اثرانگشت مرورگر را جعل می‌کند

</div>

---

## 🗺️ نقشه راه

* ☑ تبدیل خودکار IPv4 → IPv6
* ☑ اعمال خودکار cs, fm, fp
* ☑ Cron Trigger هر ۶ ساعت
* ☑ Endpoint /run برای تست دستی
* ☑ دکمه «بارگیری از گیت‌هاب»
* □ پشتیبانی از Shadowsocks فرمت قدیمی
* □ کدگذاری صحیح fragment نام
* □ هشدار در صورت طولانی شدن URL دیپ‌لینک
* □ امکان تنظیم دستی مقادیر cs / fm / fp
* □ رابط گرافیکی برای تنظیمات Worker

---

## 🤝 مشارکت

<div dir="rtl" align="right">

از Pull Request، Issue و پیشنهادات شما استقبال می‌شود.

### راهنمای مشارکت

1. پروژه را Fork کنید
2. یک Branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. تغییرات را Commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing-feature`)
5. یک Pull Request باز کنید

</div>

---

## 📄 لایسنس

<div dir="rtl" align="right">

این پروژه تحت لایسنس MIT منتشر شده است. شما آزادید که:

* ✅ از کد استفاده کنید
* ✅ آن را تغییر دهید
* ✅ در پروژه‌های تجاری به کار ببرید
* ✅ توزیع کنید

فقط کافی است نام نویسنده اصلی را ذکر کنید.

</div>

---

## 🙏 تقدیر و تشکر

<div dir="rtl" align="right">

* V2RayNG — کلاینت محبوب اندروید
* PattNG — بهینه‌سازی V2Ray برای دور زدن DPI
* Patterniha — منبع کانفیگ‌های سالم
* Cloudflare Workers — زیرساخت Cron
* GitHub Pages — میزبانی استاتیک
* جامعه کاربری که در شناسایی باگ‌ها کمک کردند

</div>

<div align="center">

🌟 اگر این پروژه به شما کمک کرد، یک ⭐ بدهید!

ساخته شده با ❤️ توسط NodeOOF

🔗 [پنل آنلاین](https://nodeoof.github.io/v2rayconfigtoPattNG/) · 📡 [Subscription](https://raw.githubusercontent.com/NodeOOF/v2rayconfigtoPattNG/refs/heads/main/configs.txt) · 🐛 [گزارش باگ](https://github.com/NodeOOF/v2rayconfigtoPattNG/issues)

</div>
