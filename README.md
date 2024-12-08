# IoT Dashboard

## Opis projektu
**IoT Dashboard** to aplikacja do monitorowania i wizualizacji danych przesyłanych z urządzeń IoT (Internet of Things). Umożliwia użytkownikowi:
- Wyświetlanie danych w czasie rzeczywistym na wykresach.
- Przeglądanie szczegółowych informacji o urządzeniach (temperatura, wilgotność, ciśnienie).
- Dodawanie danych ręcznie za pomocą formularza.
- Usuwanie danych ręcznie.

Aplikacja składa się z dwóch części:
- **Backend**: API do obsługi logiki aplikacji i komunikacji z bazą danych.
- **Frontend**: Interfejs użytkownika oparty na React.

---

## Funkcjonalności
1. **Panel użytkownika**:
   - Wyświetlanie wykresów danych w czasie rzeczywistym.
   - Lista urządzeń IoT z podsumowaniem danych.
2. **Formularz dodawania danych**:
   - Możliwość wprowadzania parametrów (ID urządzenia, temperatura, wilgotność, ciśnienie).

---

## Technologie
- **Frontend**:
  - React
  - Vite
  - Chart.js (do wykresów)
  - CSS (stylizacja)
- **Backend**:
  - Node.js
  - TypeScript
  - Express.js
  - MongoDB (baza danych)
- **Inne**:
  - JWT (autoryzacja użytkownika)
  - Axios (do komunikacji z API)

---

## Struktura projektu
### Backend
- **controllers**: Zawiera logikę kontrolerów dla obsługi API (np. `data.controller.ts`, `user.controller.ts`).
- **models**: Schematy danych (np. użytkownik, dane z urządzeń).
- **routes**: Definicje endpointów API.
- **services**: Logika biznesowa (np. operacje na bazie danych).
- **schemas**: Walidacja danych przy użyciu np. bibliotek takich jak `Joi`.
- **utils**: Narzędzia i funkcje pomocnicze.
- **config.ts**: Konfiguracja aplikacji, np. dane połączenia z bazą danych.

### Frontend
- **src/components**: Komponenty interfejsu użytkownika.

---

## Jak uruchomić projekt?

```bash
terminal
git clone https://github.com/aborgula/IoT_projekt.git
cd IoT_projekt
cd back
npm install
npm run dev

otworzyć nowy terminal
cd IoT_projekt
cd front
npm install
npm run dev

otworzyć link http://localhost:5173/
