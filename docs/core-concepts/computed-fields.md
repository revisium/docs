---
sidebar_position: 4
---

# Computed Fields

Computed fields are read-only fields whose values are calculated from other fields in the same row using formula expressions defined in the schema via `x-formula`.

## Declaration

Add `x-formula` to any field in your JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "price": { "type": "number", "default": 0 },
    "quantity": { "type": "number", "default": 0 },
    "total": {
      "type": "number",
      "default": 0,
      "readOnly": true,
      "x-formula": { "version": 1, "expression": "price * quantity" }
    }
  },
  "required": ["price", "quantity", "total"],
  "additionalProperties": false
}
```

With data `{ "price": 999, "quantity": 50 }`, the computed `total` is `49950`.

## Examples

### Numeric

```json
"total": {
  "type": "number", "default": 0, "readOnly": true,
  "x-formula": { "version": 1, "expression": "price * quantity" }
},
"discount": {
  "type": "number", "default": 0, "readOnly": true,
  "x-formula": { "version": 1, "expression": "price * 0.1" }
}
```

### String

```json
"fullName": {
  "type": "string", "default": "", "readOnly": true,
  "x-formula": { "version": 1, "expression": "concat(upper(left(firstName, 1)), \". \", lastName)" }
},
"label": {
  "type": "string", "default": "", "readOnly": true,
  "x-formula": { "version": 1, "expression": "title + \" — $\" + price" }
}
```

### Boolean

```json
"inStock": {
  "type": "boolean", "default": false, "readOnly": true,
  "x-formula": { "version": 1, "expression": "quantity > 0" }
},
"isValid": {
  "type": "boolean", "default": false, "readOnly": true,
  "x-formula": { "version": 1, "expression": "length(email) > 0 && contains(email, \"@\")" }
}
```

## Aggregations Over Arrays

Formulas can aggregate array elements using `[*]` wildcard syntax:

```json
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "qty": { "type": "number", "default": 0 },
          "unitPrice": { "type": "number", "default": 0 },
          "subtotal": {
            "type": "number", "default": 0, "readOnly": true,
            "x-formula": { "version": 1, "expression": "qty * unitPrice" }
          }
        },
        "required": ["qty", "unitPrice"]
      }
    },
    "totalAmount": {
      "type": "number", "default": 0, "readOnly": true,
      "x-formula": { "version": 1, "expression": "sum(items[*].subtotal)" }
    },
    "itemCount": {
      "type": "number", "default": 0, "readOnly": true,
      "x-formula": { "version": 1, "expression": "count(items)" }
    }
  },
  "required": ["items"]
}
```

## Formulas Inside Array Items

Special variables available inside array element formulas:

| Variable | Description |
|----------|-------------|
| `#index` | Zero-based index of the current element |
| `#first` | `true` if this is the first element |
| `#last` | `true` if this is the last element |
| `@prev` | Reference to the previous element |
| `/field` | Reference to a root-level field (outside the array) |

```json
"position": {
  "type": "number", "default": 0, "readOnly": true,
  "x-formula": { "version": 1, "expression": "#index + 1" }
},
"discountedPrice": {
  "type": "number", "default": 0, "readOnly": true,
  "x-formula": { "version": 1, "expression": "unitPrice * (1 - /discount)" }
},
"runningTotal": {
  "type": "number", "default": 0, "readOnly": true,
  "x-formula": { "version": 1, "expression": "if(#first, subtotal, @prev.runningTotal + subtotal)" }
}
```

## Available Functions

40+ built-in functions across categories:

| Category | Functions |
|----------|-----------|
| Math | `abs`, `ceil`, `floor`, `round`, `min`, `max`, `pow`, `sqrt`, `mod` |
| String | `length`, `concat`, `upper`, `lower`, `trim`, `left`, `right`, `mid`, `replace`, `contains`, `startsWith`, `endsWith` |
| Logic | `if`, `and`, `or`, `not` |
| Aggregation | `sum`, `count`, `avg`, `min`, `max` |
| Type | `toNumber`, `toString`, `toBoolean` |

Full specification: [formula SPEC.md](https://github.com/revisium/formula/blob/master/SPEC.md)

## Limitations

- Formulas reference fields within the same row only. Cross-table computed fields are not yet supported.
- Computed fields are read-only — you cannot write to them directly.
