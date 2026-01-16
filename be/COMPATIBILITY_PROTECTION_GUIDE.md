# Protection for Attributes & Attribute Values

## Overview
Sau khi refactor, hệ thống sử dụng `attribute_value_id` thay vì string để đảm bảo:
- ✅ Admin tự do đổi tên value mà không ảnh hưởng compatibility logic
- ✅ Ngăn xóa/sửa attribute/value đang được dùng trong compatibility rules

---

## 1. Protection for Attributes

### Check before delete/update
```javascript
import CompatibilityService from './services/compatibility.service.js';

// Check if attribute can be modified
const result = await CompatibilityService.canModifyAttribute(attributeId);

if (!result.canModify) {
    console.log(result.reason);
    console.log('Used in rules:', result.usedInRules);
    // → Don't allow delete/update
} else {
    // → Safe to delete/update
}
```

### Auto-validation (throws error)
```javascript
try {
    await CompatibilityService.validateAttributeDeletion(attributeId);
    // If no error thrown → safe to delete
    await deleteAttribute(attributeId);
} catch (error) {
    // Error message includes which rules are using this attribute
    console.error(error.message);
}
```

### Example Integration in Controller
```javascript
// attributeController.js
async deleteAttribute(req, res) {
    const { attributeId } = req.params;
    
    try {
        // Check if attribute is used in compatibility
        await CompatibilityService.validateAttributeDeletion(attributeId);
        
        // Safe to delete
        await AttributeDAO.deleteAttribute(attributeId);
        
        res.json({ success: true, message: 'Attribute deleted' });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
}
```

---

## 2. Protection for Attribute Values

### Check before delete
```javascript
// Check if value can be deleted
const result = await CompatibilityService.canModifyAttributeValue(attributeValueId);

if (!result.canModify) {
    console.log(result.reason);
    console.log('Used in mappings:', result.usedInMappings);
    // → Don't allow delete
} else {
    // → Safe to delete
}
```

### Check before rename (optional - đổi tên is SAFE with new design!)
```javascript
// With attribute_value_id design, renaming is SAFE!
// But if you want to notify admin:

const result = await CompatibilityService.canModifyAttributeValue(attributeValueId);

if (!result.canModify) {
    // Show warning: "This value is used in X compatibility mappings. Renaming is safe but please verify."
    console.log(`⚠️ Used in ${result.usedInMappings.length} mappings`);
}

// Still allow rename because we use ID, not string!
await AttributeValueDAO.updateValue(attributeValueId, newName);
```

### Auto-validation for delete
```javascript
try {
    await CompatibilityService.validateAttributeValueModification(attributeValueId);
    // Safe to delete
    await AttributeValueDAO.deleteValue(attributeValueId);
} catch (error) {
    console.error(error.message);
}
```

### Example Integration
```javascript
// attributeValueController.js
async deleteAttributeValue(req, res) {
    const { valueId } = req.params;
    
    try {
        // Check if used in compatibility
        await CompatibilityService.validateAttributeValueModification(valueId);
        
        // Safe to delete
        await AttributeValueDAO.deleteValue(valueId);
        
        res.json({ success: true, message: 'Value deleted' });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
}

async updateAttributeValue(req, res) {
    const { valueId } = req.params;
    const { valueName } = req.body;
    
    try {
        // Optional: Check if used (just for notification)
        const check = await CompatibilityService.canModifyAttributeValue(valueId);
        
        let warning = null;
        if (!check.canModify) {
            warning = `This value is used in ${check.usedInMappings.length} compatibility mappings. Renaming is safe.`;
        }
        
        // Update is ALWAYS safe with ID-based design
        await AttributeValueDAO.updateValue(valueId, valueName);
        
        res.json({ 
            success: true, 
            message: 'Value updated',
            warning 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}
```

---

## 3. DAO Methods Available

### Check Usage
```javascript
// Check if attribute is used
const isUsed = await CompatibilityDAO.isAttributeUsedInRules(attributeId);
// Returns: boolean

// Check if value is used
const isUsed = await CompatibilityDAO.isAttributeValueUsedInCompatibility(valueId);
// Returns: boolean
```

### Get Usage Details
```javascript
// Get rules using this attribute
const rules = await CompatibilityDAO.getRulesUsingAttribute(attributeId);
// Returns: [{ rule_id, rule_name }, ...]

// Get mappings using this value
const mappings = await CompatibilityDAO.getCompatibilityMappingsUsingValue(valueId);
// Returns: [{ cv_id, rule_name, value_1_name, value_2_name }, ...]
```

---

## 4. Summary

### ✅ What's SAFE after refactor:
- **Rename attribute_value**: Hoàn toàn an toàn vì dùng ID
- **Update value display name**: Không ảnh hưởng logic

### ❌ What's PROTECTED:
- **Delete attribute**: Không được xóa nếu đang dùng trong rules
- **Delete attribute_value**: Không được xóa nếu đang dùng trong compatibility_values

### 🎯 Best Practices:
1. Always check `canModify` before delete
2. Show warning when rename value that's in use (informational only)
3. Provide "Replace & Migrate" tool for admin (future feature)

---

## 5. Migration Checklist

- [x] 1. Run refactor_compatibility_values_to_ids.sql
- [x] 2. Run insert_compatibility_data.sql (new format)
- [x] 3. Update DAO methods (getRuleValues, addRuleValue)
- [x] 4. Update Service logic (use attribute_value_id)
- [x] 5. Add validation methods (protection)
- [ ] 6. Test với Postman
- [ ] 7. Drop old columns (value_1, value_1_normalized, value_2, value_2_normalized)
