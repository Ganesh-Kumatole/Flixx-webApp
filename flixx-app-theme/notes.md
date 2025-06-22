# 🌐 Anatomy of a URL

Example URL: https://www.example.com:443/products/view.html?id=123&sort=asc#details

## 🔍 Breakdown of URL Components

| Part                  | Name                      | Description                                                            |
| --------------------- | ------------------------- | ---------------------------------------------------------------------- |
| `https://`            | **Protocol**              | Communication method — like `http`, `https`, `ftp`. Secure if `https`. |
| `www.example.com`     | **Domain (Hostname)**     | The address of the website/server. Includes subdomain + domain name.   |
| `:443`                | **Port (optional)**       | Port number. Default: 80 for `http`, 443 for `https`. Usually hidden.  |
| `/products/view.html` | **Pathname (Path)**       | Specific page or route on the site. Starts after the domain.           |
| `?id=123&sort=asc`    | **Query String (Search)** | Extra data sent to the server. Starts with `?`, has key-value pairs.   |
| `#details`            | **Fragment (Hash)**       | Refers to a section inside the page. Not sent to the server.           |

---

## 🧠 Accessing Parts of the URL in JavaScript

```js
window.location.protocol; // "https:"
window.location.hostname; // "www.example.com"
window.location.port; // "443"
window.location.pathname; // "/products/view.html"
window.location.search; // "?id=123&sort=asc"
window.location.hash; // "#details"
window.location.href; // Full URL as a string
```

## 💡 Note:

`window.location.href` gives the full URL.
Assigning a value to `window.location.href` will redirect the page.
