# Sprint 18 UX Enhancement Audit

**Audit Date**: March 10, 2026
**Purpose**: Ensure chips, sliders, and grid enhancements don't break existing functionality
**Status**: COMPLETE - READY TO IMPLEMENT

---

## Executive Summary

| Aspect | Finding | Risk |
|--------|---------|------|
| Field IDs | Must preserve all 45 field IDs | LOW if adapter pattern used |
| Autosave | Must trigger `markDirty()` + `debouncedSave()` | LOW |
| collectFormData() | Works via `getInputValue(id)` - needs hidden inputs | LOW |
| populateForm() | Needs extension for chips/sliders | MEDIUM |
| Total new JS | ~150 lines for adapters + components | Manageable |

**Verdict**: UX enhancements are safe with adapter pattern.

---

## 1. Field Inventory

### Fields to Convert to CHIPS

| Field ID | Current Type | Location | Options Source | Multi-Select |
|----------|--------------|----------|----------------|--------------|
| `companyIndustry` | `<select>` | Tab 1: Business | API `/api/config/industries` | No |
| `industrySubtype` | `<select>` | Tab 1: Business | API by industry | No |
| `feeStructure` | `<select>` | Tab 1: Business | Hardcoded (4 options) | No |
| `priorityOne` | `<textarea>` | Tab 3: Vision | Preset + free text | No (hybrid) |
| `biggestBlocker` | `<textarea>` | Tab 3: Vision | Preset + free text | No (hybrid) |

### Fields to Convert to SLIDERS

| Field ID | Current Type | Location | Min | Max | Unit |
|----------|--------------|----------|-----|-----|------|
| `employeeCount` | `<input type="number">` | Tab 1: Business | 1 | 500 | employees |
| `metric_top_5_clients_revenue_pct` | `<input type="number">` | Tab 2: Numbers | 0 | 100 | % |
| `metric_client_retention_rate_pct` | `<input type="number">` | Tab 2: Numbers | 0 | 100 | % |

### Fields to Enhance with GRID Layout

| Section | Current Layout | Enhanced Layout | Fields |
|---------|---------------|-----------------|--------|
| Financial Performance | 4-col grid | Dashed card grid | 4 metrics |
| 12-Month Targets | 3-col grid | Dashed card grid | 3 metrics |

### Fields UNCHANGED (No conversion needed)

- `companyName`, `foundedYear`, `companyWebsite` - Text inputs work fine
- `businessDescription`, `businessModel`, `valueProposition` - Textareas work fine
- `revenueDriver`, `clientProfile` - Text inputs work fine
- All other metrics - Number inputs in cards work fine

---

## 2. Adapter Pattern Design

### 2.1 Chip Adapter

**Problem**: Chips are visual elements, but `collectFormData()` reads from `input.value`.

**Solution**: Hidden input that syncs with chip selection.

```html
<!-- BEFORE: Current dropdown -->
<select id="companyIndustry">
  <option value="">Select...</option>
  <option value="consulting">Consulting</option>
  <option value="financial_services">Financial Services</option>
</select>

<!-- AFTER: Chips + hidden select -->
<div class="chip-group" data-field="companyIndustry">
  <button type="button" class="chip" data-value="consulting">Consulting</button>
  <button type="button" class="chip" data-value="financial_services">Financial Services</button>
  <button type="button" class="chip" data-value="healthcare">Healthcare</button>
  <button type="button" class="chip" data-value="professional_services">Professional Services</button>
  <button type="button" class="chip" data-value="other">Other</button>
</div>
<!-- Hidden input preserves original ID for collectFormData() -->
<input type="hidden" id="companyIndustry" value="">
```

**JS Adapter**:
```javascript
// Add to company-profile.js
function setupChipGroups() {
  document.querySelectorAll('.chip-group').forEach(group => {
    const fieldId = group.dataset.field;
    const hiddenInput = document.getElementById(fieldId);

    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        // Update visual state
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');

        // Sync to hidden input
        hiddenInput.value = chip.dataset.value;

        // Trigger autosave
        markDirty();
        debouncedSave();

        // Update completion
        updateCompletion();
      });
    });
  });
}

// Extend populateForm() to set chip state
function populateChipFromValue(fieldId, value) {
  const group = document.querySelector(`.chip-group[data-field="${fieldId}"]`);
  if (!group || !value) return;

  group.querySelectorAll('.chip').forEach(chip => {
    chip.classList.toggle('selected', chip.dataset.value === value);
  });
}
```

### 2.2 Hybrid Chip Adapter (Chips + Free Text)

For `priorityOne` and `biggestBlocker` where user can select a preset OR type custom:

```html
<div class="chip-group-hybrid" data-field="priorityOne">
  <div class="chips">
    <button type="button" class="chip" data-value="Scale client base">Scale client base</button>
    <button type="button" class="chip" data-value="Increase revenue per client">Increase revenue per client</button>
    <button type="button" class="chip" data-value="Build team capacity">Build team capacity</button>
    <button type="button" class="chip" data-value="Systematize operations">Systematize operations</button>
  </div>
  <input type="text" id="priorityOne" placeholder="Or type your own priority..." class="form-input mt-3">
</div>
```

**JS Adapter**:
```javascript
function setupHybridChipGroups() {
  document.querySelectorAll('.chip-group-hybrid').forEach(group => {
    const fieldId = group.dataset.field;
    const textInput = document.getElementById(fieldId);

    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        // Toggle chip selection
        const wasSelected = chip.classList.contains('selected');
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));

        if (!wasSelected) {
          chip.classList.add('selected');
          textInput.value = chip.dataset.value;
        } else {
          textInput.value = ''; // Deselect clears
        }

        markDirty();
        debouncedSave();
        updateCompletion();
      });
    });

    // Clear chip selection when user types custom text
    textInput.addEventListener('input', () => {
      const currentValue = textInput.value.trim();
      const matchingChip = [...group.querySelectorAll('.chip')].find(
        c => c.dataset.value === currentValue
      );

      group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      if (matchingChip) {
        matchingChip.classList.add('selected');
      }
    });
  });
}
```

### 2.3 Slider Adapter

**Problem**: Sliders are range inputs, but original field expects number input.

**Solution**: Slider syncs to hidden input with original ID.

```html
<!-- BEFORE: Current number input -->
<input type="number" id="employeeCount" min="1" max="500">

<!-- AFTER: Slider + hidden input -->
<div class="slider-component" data-field="employeeCount" data-min="1" data-max="500" data-unit="employees">
  <div class="slider-row">
    <div class="slider-track">
      <input type="range" class="slider-input" min="1" max="500" value="50">
      <div class="slider-labels">
        <span>1</span>
        <span>Small (1-50)</span>
        <span>Medium (51-200)</span>
        <span>500</span>
      </div>
    </div>
    <div class="slider-value">
      <span class="slider-number">50</span>
      <span class="slider-unit">employees</span>
    </div>
  </div>
  <!-- Hidden input preserves original ID -->
  <input type="hidden" id="employeeCount" value="50">
</div>
```

**JS Adapter**:
```javascript
function setupSliders() {
  document.querySelectorAll('.slider-component').forEach(component => {
    const fieldId = component.dataset.field;
    const slider = component.querySelector('.slider-input');
    const display = component.querySelector('.slider-number');
    const hiddenInput = document.getElementById(fieldId);

    slider.addEventListener('input', () => {
      // Update display
      display.textContent = slider.value;

      // Sync to hidden input
      hiddenInput.value = slider.value;

      // Trigger autosave
      markDirty();
      debouncedSave();

      // Update completion
      updateCompletion();
    });
  });
}

// Extend populateForm() to set slider state
function populateSliderFromValue(fieldId, value) {
  const component = document.querySelector(`.slider-component[data-field="${fieldId}"]`);
  if (!component || !value) return;

  const slider = component.querySelector('.slider-input');
  const display = component.querySelector('.slider-number');

  slider.value = value;
  display.textContent = value;
}
```

---

## 3. Implementation Plan

### 3.1 HTML Changes

| File | Section | Changes | Lines Added |
|------|---------|---------|-------------|
| company-profile.html | Tab 1: Industry | Replace `<select>` with chip group | +20 |
| company-profile.html | Tab 1: Subtype | Replace `<select>` with chip group (conditional) | +15 |
| company-profile.html | Tab 1: Employee | Replace `<input>` with slider | +15 |
| company-profile.html | Tab 1: Fee Structure | Replace `<select>` with chips | +10 |
| company-profile.html | Tab 2: Concentration | Replace `<input>` with slider | +15 |
| company-profile.html | Tab 2: Retention | Replace `<input>` with slider | +15 |
| company-profile.html | Tab 3: Priority | Add chip presets above textarea | +15 |
| company-profile.html | Tab 3: Blocker | Add chip presets above textarea | +15 |
| company-profile.html | `<style>` | Add chip, slider, grid CSS | +80 |
| **Total** | | | **~200** |

### 3.2 JS Changes

| Function | Action | Lines |
|----------|--------|-------|
| `setupChipGroups()` | NEW - Initialize chip click handlers | 25 |
| `setupHybridChipGroups()` | NEW - Initialize hybrid chip handlers | 30 |
| `setupSliders()` | NEW - Initialize slider sync handlers | 20 |
| `populateChipFromValue()` | NEW - Set chip state on load | 10 |
| `populateSliderFromValue()` | NEW - Set slider state on load | 10 |
| `populateForm()` | EXTEND - Call new populate functions | +15 |
| `DOMContentLoaded` | EXTEND - Call new setup functions | +5 |
| **Total** | | **~115** |

### 3.3 CSS Changes (inline in HTML)

```css
/* Chip styles */
.chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: white;
  color: #4b5563;
  transition: all 0.15s ease;
}
.chip:hover { border-color: #1e3a5f; color: #1e3a5f; transform: scale(1.02); }
.chip.selected { border-color: #1e3a5f; background: #1e3a5f; color: white; }

/* Slider styles */
.slider-component { margin-bottom: 16px; }
.slider-row { display: flex; align-items: center; gap: 20px; }
.slider-track { flex: 1; }
.slider-input {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  appearance: none;
  cursor: pointer;
}
.slider-input::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: grab;
  border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.slider-labels { display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; margin-top: 4px; }
.slider-value { text-align: right; min-width: 80px; }
.slider-number { font-size: 28px; font-weight: 700; color: #1e3a5f; line-height: 1; }
.slider-unit { font-size: 11px; color: #6b7280; }

/* Enhanced metric card styles */
.metric-card-enhanced {
  background: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.metric-card-enhanced:hover { border-color: #8b5cf6; }
.metric-card-enhanced:focus-within { border-color: #8b5cf6; border-style: solid; background: white; }
.metric-card-enhanced.filled { border-color: #10b981; border-style: solid; background: #d1fae5; }

/* Priority card (gold highlight) */
.priority-card {
  background: linear-gradient(135deg, #fef9f0, #fdf6e9);
  border: 2px solid #d4a853;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}
```

---

## 4. Risk Mitigation

### Risk 1: collectFormData() Breaks

**Cause**: Hidden inputs not found
**Mitigation**:
- Keep original field IDs on hidden inputs
- Test `collectFormData()` output after each change
- Add console.log in dev to verify data shape

**Test**:
```javascript
// Add to test after each UX change
console.log('Form data:', collectFormData());
```

### Risk 2: populateForm() Misses New Components

**Cause**: Sliders/chips not populated on page load
**Mitigation**:
- Extend `populateForm()` to call new populate functions
- Call after existing `setInputValue()` calls

**Fix**:
```javascript
function populateForm() {
  // ... existing setInputValue() calls ...

  // NEW: Populate chips
  populateChipFromValue('companyIndustry', companyData.industry);
  populateChipFromValue('feeStructure', companyData.business_context?.profile?.fee_structure);

  // NEW: Populate sliders
  populateSliderFromValue('employeeCount', companyData.employee_count);
  populateSliderFromValue('metric_top_5_clients_revenue_pct',
    companyData.business_context?.metrics?.current?.top_5_clients_revenue_pct?.value);
}
```

### Risk 3: Autosave Not Triggered

**Cause**: New components don't call `markDirty()`
**Mitigation**:
- Every chip click handler calls `markDirty()` + `debouncedSave()`
- Every slider input handler calls `markDirty()` + `debouncedSave()`

**Test**:
- Fill field → wait 2.1s → check Network tab for PUT request
- Change chip → verify autosave indicator shows "Saving..."

### Risk 4: updateCompletion() Miscounts

**Cause**: Completion checks `el.value` which may be empty for visual-only chips
**Mitigation**:
- Hidden inputs always have values synced
- `getInputValue()` reads hidden input, not chip visuals

### Risk 5: Industry Subtype Dropdown Logic Breaks

**Cause**: `populateSubtypeDropdown()` expects `<select>` element
**Mitigation**:
- Convert subtype to chips but keep hidden select
- Subtype chips populate dynamically via JS
- OR defer subtype conversion to future sprint

**Recommendation**: Defer `industrySubtype` chip conversion (complex API-driven logic)

---

## 5. Testing Checklist

### Before Each Session

- [ ] `npm run dev` starts without errors
- [ ] Page loads without console errors
- [ ] Existing fields populate correctly

### After Each Component

- [ ] **Chip Selection**: Click chip → hidden input updates
- [ ] **Chip Population**: On load, saved value shows as selected chip
- [ ] **Slider Sync**: Move slider → hidden input + display update
- [ ] **Slider Population**: On load, saved value shows on slider
- [ ] **Autosave**: Change any field → autosave triggers in 2s
- [ ] **Completion Ring**: Changes update completion %
- [ ] **Form Submit**: Manual save works with new components

### Final Validation

- [ ] Create new company → fill all fields → save → reload → all fields populated
- [ ] Edit existing company → change via chips/sliders → save → reload → changes persisted
- [ ] Risk warnings still trigger (concentration, aging, next-gen)

---

## 6. Implementation Order

Execute in this order to minimize risk:

| Order | Component | Reason |
|-------|-----------|--------|
| 1 | CSS styles | Add all styles first (no behavior change) |
| 2 | JS adapter functions | Add functions (not called yet) |
| 3 | Employee slider | Simple, isolated, Tab 1 |
| 4 | Industry chips | Tab 1, replaces single select |
| 5 | Fee structure chips | Tab 1, simple hardcoded options |
| 6 | Priority hybrid chips | Tab 3, high impact field |
| 7 | Blocker hybrid chips | Tab 3, similar to priority |
| 8 | Concentration slider | Tab 2, percentage |
| 9 | Retention slider | Tab 2, percentage |
| 10 | Enhanced metric cards | Visual polish only |

**Deferred**:
- `industrySubtype` chips (complex API-driven, has cascading logic)

---

## 7. Summary

### Safe to Convert (10 items)

| Component | Field(s) | Complexity |
|-----------|----------|------------|
| Slider | `employeeCount` | LOW |
| Slider | `metric_top_5_clients_revenue_pct` | LOW |
| Slider | `metric_client_retention_rate_pct` | LOW |
| Chips | `companyIndustry` | MEDIUM |
| Chips | `feeStructure` | LOW |
| Hybrid Chips | `priorityOne` | MEDIUM |
| Hybrid Chips | `biggestBlocker` | MEDIUM |
| Visual | Enhanced metric cards | LOW |
| Visual | Priority gold card | LOW |
| Visual | Row-2 layouts | LOW |

### Deferred (1 item)

| Component | Field | Reason |
|-----------|-------|--------|
| Chips | `industrySubtype` | Complex cascading API logic |

### Code Impact

| File | Lines Added | Risk |
|------|-------------|------|
| company-profile.html | ~200 | LOW |
| company-profile.js | ~115 | LOW |
| **Total** | **~315** | **LOW** |

---

## 8. Approval

**This audit confirms UX enhancements are safe to implement with:**

1. ✅ Adapter pattern preserves all 45 field IDs
2. ✅ Hidden inputs maintain `collectFormData()` compatibility
3. ✅ Explicit `markDirty()` calls ensure autosave works
4. ✅ Extended `populateForm()` handles new components
5. ✅ `industrySubtype` deferred to avoid complexity

**Ready for implementation**: Epic M6 approved.

---

**Document Version**: 1.0
**Last Updated**: March 10, 2026
**Auditor**: Claude Strategy Session
