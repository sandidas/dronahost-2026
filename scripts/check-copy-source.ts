/**
 * Fails on page copy that lives in a component instead of the page JSON, content/claims.ts or content/strings.ts
 * (rules/page-blueprints.md, rule 9). Reads the files in scripts/copy-source.config.json with the TypeScript parser and
 * reports every visible text literal: JSX text, text attributes (aria-label, alt, ...), default values and object properties
 * that hold copy (title, description, label, ...). Exit 1 with one line per literal.
 * Usage: npx tsx scripts/check-copy-source.ts [file ...]
 */
import { readFileSync } from "node:fs";
import ts from "typescript";

type Config = { files: string[]; textAttributes: string[]; textKeys: string[]; allow: string[] };
const config = JSON.parse(readFileSync("scripts/copy-source.config.json", "utf8")) as Config;
const files = process.argv.length > 2 ? process.argv.slice(2) : config.files;
const attrs = new Set(config.textAttributes);
const keys = new Set(config.textKeys);
const allow = new Set(config.allow);

/** Looks like words a visitor would read: at least two letters, and either a space or a capital start. Not a class list, path, URL, id, CSS value or import. */
function isCopy(text: string): boolean {
  const t = text.replace(/\s+/g, " ").trim();
  if (allow.has(t) || t.length < 2 || !/[A-Za-z]{2}/.test(t)) return false;
  if (/^(https?:|\/|#|\.|--|var\(|[a-z]+:[a-z]|@)/i.test(t) || /^[\w./:-]+$/.test(t) && !/^[A-Z]/.test(t)) return false;
  if (/^[&#;a-z0-9]+$/i.test(t) && t.includes("&")) return false;
  if (/\b(flex|grid|text-|bg-|px-|py-|mt-|mb-|gap-|border|rounded|size-|w-|h-|sm:|md:|lg:)/.test(t) && !/[.?!,]$/.test(t)) return false;
  return /\s/.test(t) || /^[A-Z]/.test(t);
}

/** Attributes whose string values are structure (classes, links, ids, enums), never copy. */
const IGNORE_ATTRS = /^(className|href|id|key|type|variant|size|role|rel|target|name|style|htmlFor|data-.*|as|aria-labelledby|aria-describedby|aria-live|icon|src|sizes|loading|autoComplete|inputMode)$/;

const found: string[] = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, /\.tsx(\.txt)?$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const report = (node: ts.Node, kind: string, value: string): void => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart());
    found.push(`${file}:${line + 1} ${kind} "${value.replace(/\s+/g, " ").trim().slice(0, 70)}" is page copy in a component. Move it to the page JSON, content/claims.ts or content/strings.ts`);
  };
  const keyName = (n: ts.PropertyName | ts.BindingName): string => (ts.isIdentifier(n) || ts.isStringLiteral(n) ? n.text : "");
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node) || ts.isTypeNode(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) return;
    if (ts.isJsxText(node) && isCopy(node.text)) report(node, "JSX text", node.text);
    if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer) && attrs.has(node.name.getText()) && isCopy(node.initializer.text)) report(node, `${node.name.getText()}=`, node.initializer.text);
    if (ts.isPropertyAssignment(node) && keys.has(keyName(node.name)) && (ts.isStringLiteral(node.initializer) || ts.isNoSubstitutionTemplateLiteral(node.initializer)) && isCopy(node.initializer.text)) report(node, `${keyName(node.name)}:`, node.initializer.text);
    if (ts.isBindingElement(node) && node.initializer && ts.isStringLiteral(node.initializer) && /(label|title|text|heading|caption|description|eyebrow)$/i.test(keyName(node.name)) && isCopy(node.initializer.text)) report(node, `default ${keyName(node.name)} =`, node.initializer.text);
    if (ts.isJsxAttribute(node) && node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression && !IGNORE_ATTRS.test(node.name.getText())) {
      const walk = (n: ts.Node): void => {
        if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && isCopy(n.text)) report(n, `${node.name.getText()}={...}`, n.text);
        ts.forEachChild(n, walk);
      };
      walk(node.initializer.expression);
    }
    if (ts.isJsxExpression(node) && node.expression && ts.isStringLiteral(node.expression) && isCopy(node.expression.text)) report(node, "JSX string", node.expression.text);
    if (ts.isBinaryExpression(node) && (node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken || node.operatorToken.kind === ts.SyntaxKind.BarBarToken) && ts.isStringLiteral(node.right) && isCopy(node.right.text)) report(node, "fallback", node.right.text);
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

if (found.length) {
  console.log(found.join("\n"));
  console.log(`\n${found.length} text literal(s) outside the page JSON, the claims and content/strings.ts.`);
  process.exit(1);
}
console.log(`No page copy in ${files.length} component file(s).`);
