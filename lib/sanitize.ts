import DOMPurify from "isomorphic-dompurify"

/**
 * Post bodies are HTML produced by the editor and rendered with
 * dangerouslySetInnerHTML, so they have to be sanitised before they reach
 * the page. Without this, anyone who can write a post can run script in
 * every visitor's browser — including other admins, whose session it would
 * then be able to act on.
 *
 * The allowlist matches what the editor can actually produce.
 */
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s", "span",
  "h1", "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote", "code", "pre",
  "a", "img", "hr",
]

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "style", "class"]

export function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Only these schemes may appear in href/src.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i,
    // Blocks every on* handler and anything not on the lists above.
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "formaction"],
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
  })
}

/**
 * Admin-entered links (store pages, portfolios, social profiles) are only
 * ever meaningful as web addresses. Anything else is rejected at save time.
 */
export function isSafeUrl(value: string) {
  return /^https?:\/\/.+/i.test(value.trim())
}
