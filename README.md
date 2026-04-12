# petstore-vue

Vue CRUD application using Petstore API  
(migrated from `petstore-react`)

---

# Vue vs React - Overview

## Apa itu Vue?

Vue adalah progressive JavaScript framework untuk membangun user interface (UI) dan single page application (SPA).

Vue dirancang agar mudah dipelajari, fleksibel, dan scalable, sehingga cocok digunakan mulai dari aplikasi kecil hingga enterprise.

---

## Kesamaan Vue dan React

Meskipun pendekatan keduanya berbeda, banyak konsep inti yang sebenarnya serupa.

### 1. Component-Based Architecture

- React → Functional Component
- Vue → Single File Component (`.vue`)

Keduanya membangun UI menggunakan komponen yang reusable dan modular.

---

### 2. Data Binding

- React → One-way binding dengan `state`
- Vue → One-way & Two-way binding (`v-model`)

Sama-sama menghubungkan data ke UI secara reactive.

---

### 3. Event Handling

- React → `onClick={handleClick}`
- Vue → `@click="handleClick"`

Keduanya menggunakan declarative event handling.

---

### 4. Routing

- React → React Router
- Vue → Vue Router

Sama-sama mendukung SPA navigation dan nested routes.

---

### 5. Forms Handling

- React → Controlled Components / React Hook Form
- Vue → `v-model` + form validation library

Keduanya mendukung validasi form dan state management form.

---

### 6. HTTP Request

- React → `fetch`, `axios`, `react-query`
- Vue → `fetch`, `axios`, `vue-query`

Digunakan untuk komunikasi API dan data fetching.

---

## Perbedaan Vue dan React

| Aspek            | React                          | Vue                              |
| ---------------- | ------------------------------ | -------------------------------- |
| Tipe             | Library                        | Framework                        |
| Syntax           | JSX / TSX                      | HTML Template + Script           |
| Data Binding     | One-way                        | One-way + Two-way                |
| State Management | External (Redux, Zustand, dll) | Pinia / Vuex                     |
| Learning Curve   | Mudah                          | Sangat mudah                     |
| Flexibility      | Sangat fleksibel               | Lebih terstruktur                |
| Boilerplate      | Sedang                         | Lebih sedikit                    |
| Ecosystem        | Sangat luas                    | Sangat lengkap                   |

---

## Tips Migrasi React ke Vue

### 1. Ubah Mindset (JSX → Template)

React menggunakan JSX, sedangkan Vue menggunakan template syntax.

React:

```tsx
<button onClick={handleClick}>Click</button>
```

Vue:

```vue
<button @click="handleClick">Click</button>
```

---

### 2. State Management

React:

```tsx
const [count, setCount] = useState(0)
```

Vue:

```vue
const count = ref(0)
```

Vue menggunakan reactivity system seperti:

- `ref()`
- `reactive()`
- `computed()`

---

### 3. Lifecycle

React:

```tsx
useEffect(() => {})
```

Vue:

```vue
onMounted(() => {})
```

---

### 4. Struktur Folder

Untuk mempermudah migrasi dari React, struktur folder dibuat tetap familiar.

```text
src/
├── core/
├── shared/
├── features/
├── router/
├── services/
```

Dengan struktur ini:

- proses migrasi lebih cepat
- developer lebih mudah adaptasi
- project tetap scalable

---

## Kelebihan Vue dibanding React

- Lebih mudah dipelajari
- Syntax lebih clean dan readable
- Built-in directives (`v-if`, `v-for`, `v-model`)
- Boilerplate lebih sedikit
- State reactivity lebih sederhana

---

## Kekurangan Vue dibanding React

- Ecosystem lebih kecil dibanding React
- Market demand lebih sedikit
- Pilihan library tidak sebanyak React

---

## Teknologi yang Digunakan

- Vue 3
- TypeScript
- Vite
- Vue Router
- Axios
- Pinia
- Petstore API

---

## API Source

Petstore Swagger API:

https://petstore.swagger.io/

---

## Kesimpulan

React dan Vue memiliki konsep yang sangat mirip.

Migrasi dari React ke Vue tidak terlalu sulit jika memahami:

- component
- state
- event
- lifecycle
- routing

Perbedaan utama hanya pada cara implementasi dan syntax.

Vue memberikan pendekatan yang lebih sederhana dan clean untuk membangun aplikasi modern.

---

_Dokumen ini merupakan bagian dari proses migrasi aplikasi dari React ke Vue menggunakan Petstore API._
