# 🚀 WELCOME TO NB SCRAPER DOCUMENTATION

**⭐ Love this project? Star the [Repository](https://github.com/Chakszzz/NB-Scraper)!**  
**📢 Join our WhatsApp Channel: [NB SCRIPT ~](https://whatsapp.com/channel/0029Vb5EZCjIiRotHCI1213L)**

---

## 🛠️ GETTING STARTED

### Installation

Choose your preferred package manager:

```bash
# npm
npm install nb-scraper
```

```bash
# yarn
yarn add nb-scraper
```

```bash
# pnpm
pnpm add nb-scraper
```

### Basic Usage

```typescript
import { generatePollinationsImage } from "nb-scraper";

const result = await generatePollinationsImage({
  prompt: "a beautiful sunset over mountains",
  nologo: true,
});

if (result.status) {
  console.log(result.data.url); // Catbox.moe URL
} else {
  console.error(result.error);
}
```

---

## Further Integrating

Explore all available functions and examples:  
[Full API Documentation](https://chakszzz.github.io/NB-Scraper/modules.html)

---

## 🤝 CONTRIBUTING

We welcome contributions! Please read our:  
[Contribution Guidelines](CONSTRIBUTING.md)

---

## 💬 SUPPORT

For updates and support:  
🔗 [GitHub Repository](https://github.com/Chakszzz/NB-Scraper)  
📱 [WhatsApp Channel](https://whatsapp.com/channel/0029V5EZCjIiRotHCI1213L)
