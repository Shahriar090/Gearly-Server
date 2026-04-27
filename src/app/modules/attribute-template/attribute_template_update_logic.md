# Attribute Template Update Logic (PATCH)

## 📌 Overview

This module implements a **PATCH-based update system** for attribute templates.

Instead of replacing the entire template, we perform **granular updates** such as:

* Updating group **fields**
* Updating specific attributes
* Adding new attributes
* Deleting existing attributes

This approach is **efficient, scalable, and production-friendly**.

---

# 🧠 1. Technique Used: PATCH-Based Update Strategy

### ❓ What is the technique?

We use a **PATCH-style update mechanism**, where the client sends only the changes instead of the full object.

### ❌ Traditional (Bad Approach)

```json
{
  "template": { ...full object... }
}
```

Problems:

* Overwrites entire document
* Risk of accidental data loss
* Inefficient (large payloads)

---

### ✅ Our Approach (PATCH)

```json
{
  "templateId": "...",
  "groupUpdates": [...],
  "attributeUpdates": [...],
  "addAttributes": [...],
  "deleteAttributes": [...]
}
```

### 💡 Why this works better

* Only changed parts are updated
* Smaller payloads
* Safer updates
* Matches real-world systems (Git, DB operations, APIs)

---

# 🧩 2. Why We Structured Updates Like This

We divided updates into **operation-based groups**:

---

## 🔹 1. `groupUpdates`

```json
{
  "groupId": "...",
  "data": {
    "groupName": "New Name",
    "order": 2
  }
}
```

### WHY:

* Groups are top-level units inside template
* Allows modifying group metadata without touching attributes

---

## 🔹 2. `attributeUpdates`

```json
{
  "groupId": "...",
  "attributeId": "...",
  "data": {
    "name": "Updated Name",
    "required": true
  }
}
```

### WHY:

* Attributes are nested inside groups
* We need both `groupId` and `attributeId` to locate them
* Supports partial updates (only changed fields)

---

## 🔹 3. `addAttributes`

```json
{
  "groupId": "...",
  "attributes": [
    {
      "name": "Color",
      "key": "color",
      "type": "select",
      "options": ["Red", "Blue"]
    }
  ]
}
```

### WHY:

* Keeps creation separate from updates
* Cleaner logic and easier validation

---

## 🔹 4. `deleteAttributes`

```json
{
  "groupId": "...",
  "attributeIds": ["id1", "id2"]
}
```

### WHY:

* Explicit deletion avoids ambiguity
* Prevents accidental removal

---

## 🧠 Key Design Principle

> **Think in operations, not full objects**

Instead of:

* "Here is my new state"

We say:

* "Here is what I want to change"

---

# 🧪 3. How to Test Using Postman

---

## 🔹 Endpoint

```
PATCH http://localhost:7000/api/v1/attribute-template/update
```

---

## 🔹 Headers

```
Content-Type: application/json
```

---

## ✅ Test Case 1: Update Group Name

```json
{
  "templateId": "TEMPLATE_ID",
  "groupUpdates": [
    {
      "groupId": "GROUP_ID",
      "data": {
        "groupName": "Updated Group Name"
      }
    }
  ]
}
```

---

## ✅ Test Case 2: Update Attribute

```json
{
  "templateId": "TEMPLATE_ID",
  "attributeUpdates": [
    {
      "groupId": "GROUP_ID",
      "attributeId": "ATTRIBUTE_ID",
      "data": {
        "name": "Updated Attribute Name",
        "required": true
      }
    }
  ]
}
```

---

## ✅ Test Case 3: Add Attributes

```json
{
  "templateId": "TEMPLATE_ID",
  "addAttributes": [
    {
      "groupId": "GROUP_ID",
      "attributes": [
        {
          "name": "Storage",
          "key": "storage",
          "type": "number",
          "unit": "GB"
        }
      ]
    }
  ]
}
```

---

## ✅ Test Case 4: Delete Attributes

```json
{
  "templateId": "TEMPLATE_ID",
  "deleteAttributes": [
    {
      "groupId": "GROUP_ID",
      "attributeIds": ["ATTRIBUTE_ID"]
    }
  ]
}
```

---

## ✅ Test Case 5: Combined Operations (Real Scenario)

```json
{
  "templateId": "TEMPLATE_ID",
  "groupUpdates": [
    {
      "groupId": "GROUP_ID",
      "data": { "groupName": "New Name" }
    }
  ],
  "attributeUpdates": [
    {
      "groupId": "GROUP_ID",
      "attributeId": "ATTRIBUTE_ID",
      "data": { "required": true }
    }
  ],
  "addAttributes": [
    {
      "groupId": "GROUP_ID",
      "attributes": [
        {
          "name": "Color",
          "key": "color",
          "type": "select",
          "options": ["Red", "Blue"]
        }
      ]
    }
  ]
}
```

---

# ⚙️ 4. Backend Flow

```
Request (Postman)
   ↓
Route (PATCH)
   ↓
Controller
   ↓
Zod Validation
   ↓
Service Layer (apply operations)
   ↓
MongoDB (save)
```

---

# ⚠️ 5. Common Mistakes

---

### ❌ 1. Wrong payload structure

```json
{
  "payload": { ... }
}
```

👉 Fix: send flat object

---

### ❌ 2. Invalid IDs

* Wrong `groupId` or `attributeId`
* Leads to "not found" errors

---

### ❌ 3. Missing operations

```json
{
  "templateId": "..."
}
```

👉 Will fail due to validation rule

---

### ❌ 4. Nested updates not saved

👉 Fix:

```ts
template.markModified('groups');
```

---

# 🧠 6. Key Learnings

---

## ✅ 1. PATCH over PUT

* Efficient updates
* Safer operations

---

## ✅ 2. Operation-based design

* Scalable
* Easy to extend

---

## ✅ 3. Embedded document updates

* Faster reads
* Single document control

---

## ✅ 4. Validation-first architecture

* Zod ensures clean data before logic runs

---

# 🔥 Final Note

This system is not just CRUD.

It is a:

* **Dynamic schema engine**
* **Flexible attribute system**
* **Scalable update architecture**

This pattern is used in:

* eCommerce platforms
* CMS builders
* Dynamic form systems

---

If extended properly, this can power:

* dynamic filters
* product configurations
* admin dashboards
