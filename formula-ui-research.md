# Formula UI Research: Визуализация вычисляемых полей

## Контекст

Revisium поддерживает формулы (`x-formula`) для вычисляемых полей в рамках одной записи. Данные могут иметь сложную структуру:
- Вложенные объекты (`stats.strength`, `damage.min`)
- Массивы объектов (`items[0].price`, `equipment[*].slot`)
- ForeignKey связи (`faction_id → factions`)
- Формулы с зависимостями (`total = price * quantity`)

**Проблема:** Текущие режимы Tree/JSON не дают понимания "как данные связаны и откуда берутся значения".

## Текущее состояние UI

### Режимы отображения
- **Tree View** — иерархическое дерево с expand/collapse, виртуализация
- **JSON View** — CodeMirror редактор с syntax highlighting
- **RefBy View** — показывает записи, ссылающиеся на текущую

### Отображение формул
- Иконка `ƒ` (PiFunctionLight) рядом с именем поля
- Tooltip с выражением формулы + description
- Поля с формулой помечены как `readOnly`
- FormulaEngine пересчитывает значения при изменении зависимостей

## Гипотезы и UX паттерны

### 1. Formula Highlight Mode (Excel-like)

**Идея:** При наведении/фокусе на вычисляемое поле подсвечивать все поля-источники.

```
┌─────────────────────────────────────────┐
│ price:        100          ← source     │
│ quantity:     5            ← source     │
│ total:        500  ƒ       ← highlight  │
│               ↳ price * quantity        │
└─────────────────────────────────────────┘
```

**Best practice:** Excel подсвечивает ячейки разными цветами при редактировании формулы.

**Реализация:**
- При hover/focus на поле с формулой — парсить expression
- Находить зависимые поля по путям из формулы
- Подсвечивать их цветом или показывать стрелки связей
- Mini-preview формулы inline

**Сложность:** Средняя
**Ценность:** Высокая — понимание зависимостей без переключения режимов

---

### 2. Card/Summary View (Airtable expanded record)

**Идея:** Третий режим "Card" — компактное отображение с группировкой по смыслу.

```
┌─ NPC: Crystal Keeper ─────────────────────┐
│                                           │
│ ┌─ Basic ─────┐  ┌─ Stats ───────────┐    │
│ │ name: ...   │  │ strength: 15      │    │
│ │ level: 10   │  │ agility: 12       │    │
│ │ health: 200 │  │ intelligence: 25  │    │
│ └─────────────┘  └───────────────────┘    │
│                                           │
│ ┌─ Equipment ──────────────────────────┐  │
│ │ [slot: weapon] → Enchanted Staff     │  │
│ │ [slot: armor]  → Crystal Armor       │  │
│ └──────────────────────────────────────┘  │
│                                           │
│ ┌─ Computed ƒ ─────────────────────────┐  │
│ │ totalDamage: 45  ← attack * modifier │  │
│ │ effectiveDef: 30 ← defense + bonus   │  │
│ └──────────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

**Best practice:** Airtable expanded record — группирует поля в секции.

**Преимущества:**
- Формулы визуально отделены от input-полей
- Массивы показаны как inline списки
- ForeignKey резолвятся в человекочитаемые названия

**Сложность:** Высокая
**Ценность:** Высокая — лучший обзор для сложных записей

---

### 3. Split View: Inputs → Outputs

**Идея:** Разделить экран на две части — слева редактируемые поля, справа вычисляемые.

```
┌─────────────────┬──────────────────────┐
│ INPUTS          │ COMPUTED (readonly)   │
├─────────────────┼──────────────────────┤
│ price: [100]    │ total: 500           │
│ quantity: [5]   │ inStock: ✓           │
│ taxRate: [0.1]  │ priceWithTax: 110    │
│                 │                      │
│ items: [...]    │ itemsCount: 3        │
│                 │ totalWeight: 2.5kg   │
└─────────────────┴──────────────────────┘
```

**Best practice:** Grist показывает computed колонки отдельным цветом.

**Преимущества:**
- Четкое разделение "что редактирую" vs "что вычисляется"
- Удобно для форм с большим количеством формул

**Сложность:** Средняя
**Ценность:** Средняя — хорошо для плоских структур, хуже для вложенных

---

### 4. Contextual Mini-Spreadsheet (для массивов)

**Идея:** Когда массив содержит объекты с одинаковой структурой — показывать как таблицу.

```
items: (3 items)
┌────────────────┬──────┬──────────┬──────────┐
│ name           │ price│ quantity │ subtotal ƒ│
├────────────────┼──────┼──────────┼──────────┤
│ Sword          │ 100  │ 2        │ 200      │
│ Shield         │ 50   │ 1        │ 50       │
│ Potion         │ 10   │ 5        │ 50       │
├────────────────┼──────┼──────────┼──────────┤
│                │      │ TOTAL:   │ 300 ƒ    │
└────────────────┴──────┴──────────┴──────────┘
```

**Best practice:** Flexmonster — pivot table для nested data.

**Детекция:**
- Массив с ≥2 элементами
- Все элементы — объекты с одинаковыми ключами
- Кнопка переключения "List ↔ Table"

**Сложность:** Средняя
**Ценность:** Очень высокая — массивы объектов очень частый паттерн

---

### 5. Schema-Driven Layout

**Идея:** Использовать мета-данные схемы для автоматической группировки.

**Алгоритм автогруппировки:**
1. Поля с `x-formula` → секция "Computed"
2. Поля с `foreignKey` → секция "Relations"
3. Вложенные объекты → отдельные карточки
4. Массивы → inline таблицы или списки
5. Примитивы → секция "Fields"

**Опциональное расширение схемы:**
```json
{
  "x-ui-group": "pricing",
  "x-ui-order": 1,
  "x-ui-display": "currency"
}
```

**Сложность:** Низкая (без расширений) / Высокая (с расширениями)
**Ценность:** Средняя — автоматика не всегда угадывает

---

## Рекомендуемый план реализации

### Фаза 1: Formula Overlay в Tree View (быстрый win)

**Что делаем:**
- При hover на `ƒ` поле — подсветка зависимостей в дереве
- Цветовое кодирование: input (обычный) vs computed (фиолетовый/синий фон)
- Расширенный tooltip: формула + текущие значения зависимостей

**Изменения:**
- `Field.tsx` — добавить onMouseEnter/onMouseLeave для formula полей
- `TreeDataCardWidget` — контекст для передачи highlighted paths
- `Row.tsx` — применять highlight стиль если path в highlighted set

**Оценка:** 2-3 дня

---

### Фаза 2: Array Table Mode

**Что делаем:**
- Автодетекция: массив объектов с одинаковой структурой
- Toggle кнопка "List ↔ Table" для таких массивов
- Inline редактирование в таблице
- Подсветка computed колонок

**Изменения:**
- Новый renderer `ArrayTableRenderer` в registry
- Детектор однородности массива в `ArrayValueNode`
- Mini-table компонент с виртуализацией

**Оценка:** 5-7 дней

---

### Фаза 3: Card View

**Что делаем:**
- Новый режим (Tree / JSON / Card)
- Автогруппировка по типу поля
- Резолв foreignKey в названия (async fetch)
- Секция Computed внизу

**Изменения:**
- Новый `CardViewRenderer`
- ViewModel для группировки полей
- ForeignKey resolver service
- UI компоненты: FieldGroup, RelationBadge, ComputedSection

**Оценка:** 7-10 дней

---

## Примеры сложных записей (из demos/quests)

### Item Schema (вложенные объекты + массивы)
```
item
├── name: string
├── item_type_id: foreignKey → item_types
└── properties: object
    ├── damage: object { min, max, type }
    ├── defense: number
    ├── effects: array of { effect_id, chance }
    ├── modifiers: array of { stat_id, value }
    └── requirements: object
        ├── level: number
        └── class_ids: array of foreignKey
```

### NPC Schema (stats + equipment)
```
npc
├── name: string
├── location_id: foreignKey → locations
└── attributes: object
    ├── level: number
    ├── health: number
    ├── stats: object { strength, agility, intelligence }
    ├── equipment: array of { slot, item_id }
    └── faction_id: foreignKey → factions
```

### Пример с формулами (гипотетический)
```
order
├── items: array of { product_id, price, quantity, subtotal ƒ }
├── subtotal ƒ = SUM(items[*].subtotal)
├── taxRate: number
├── tax ƒ = subtotal * taxRate
├── shipping: number
└── total ƒ = subtotal + tax + shipping
```

---

## Источники и референсы

- [JSON Crack](https://jsoncrack.com/) — graph visualization для JSON
- [Airtable](https://www.whalesync.com/blog/airtable-vs-notion-the-ultimate-guide) — multiple views pattern, expanded record
- [Grist](https://www.getgrist.com/lookup/best-airtable-alternatives/) — open-source spreadsheet с формулами
- [Flexmonster](https://www.monterail.com/blog/javascript-libraries-data-visualization) — pivot tables для nested data
- [Coda](https://coda.io/@hector/how-to-decide-between-airtable-coda-notion-and-sheets) — формулы в документах
- [LogRocket JSON Tools](https://blog.logrocket.com/visualize-json-data-popular-tools/) — обзор JSON визуализации

---

## Метрики успеха

1. **Time to understand** — сколько времени нужно чтобы понять структуру записи
2. **Error rate** — ошибки при редактировании (случайное изменение computed поля)
3. **Feature discoverability** — понимают ли пользователи что поле вычисляемое
4. **Satisfaction** — субъективная оценка удобства

---

*Документ создан: 2025-02-12*
*Автор: Claude Code research*
