# math-expressions
Add subtract multiply divide math expressions.

## Expression Examples

- `"x * y + 37 * y + 5 * x"`
- `"x*y+37*y+5*x"`
- `[ [2, "x", "y"], [37], ["z"] ]` will be converted to `2xy + 37 + z`

## Usage

### Adding expressions

```js
const result = Expressions.add("x + 1", "y + 2 * x");
console.log(Expressions.stringify(result)); // "1 + 3 * x + y"
```

### Subtracting expressions

```js
const result = Expressions.subtract("x + 1", "y + 2 * x");
console.log(Expressions.stringify(result)); // "1 - 1 * x - 1 * y"
```

### Multiply expressions

```js
const result = Expressions.multiply("x + 1", "y + 2 * x");
console.log(Expressions.stringify(result)); // "x * y + 2 * x * x + y + 2 * x"
```