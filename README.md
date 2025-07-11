# Roblox Game Item Store

This project is a feature-rich, single-page web application that simulates an e-commerce platform for selling in-game items, inspired by modern storefronts like the Roblox marketplace. It's built entirely on the frontend using React and TypeScript, with a mock API service to simulate backend behavior.

The application provides distinct experiences for two user roles: a regular **User** who can browse, buy, and manage items, and an **Admin** who has full control over the store's inventory and can view sales analytics.

---

## ✨ Core Features

-   **Dynamic Storefront**: Browse items, with real-time searching and filtering by category.
-   **Shopping Cart**: A fully functional sidebar cart where users can add items, adjust quantities, and remove them.
-   **User Wallet & Top-Up**: Users have a virtual wallet with a balance, which can be topped up via a modal.
-   **Secure Checkout**: The checkout process validates the user's balance before completing a purchase.
-   **Personal Inventory**: Purchased items are added to a user's personal inventory, accessible through a modal.
-   **Role-Based Access Control**:
    -   **User View**: Can shop, top-up their wallet, and view their inventory.
    -   **Admin View**: Can add, edit, and delete items from the store. They can also add new categories.
-   **Sales Dashboard**: A comprehensive analytics dashboard for admins, showing total revenue, items sold, top-selling products, and recent transactions.
-   **Interactive Role Switcher**: A simple UI toggle allows for easy testing of both User and Admin perspectives.
-   **Toast Notifications**: Provides user-friendly feedback for actions like adding items to the cart, purchases, and errors.

---

## 🏗️ Project Structure & Workflow

The application is architected to separate concerns, making the code clean, scalable, and easy to understand. It follows a component-based model where the main `App.tsx` component acts as a central controller for state and logic.

### File Breakdown

-   **`index.html`**: The main HTML shell. It includes the Tailwind CSS CDN and sets up the root div for the React application.
-   **`index.tsx`**: The entry point for React, which renders the `App` component into the DOM.
-   **`types.ts`**: Contains all global TypeScript type definitions and interfaces (e.g., `Item`, `User`, `CartItem`), ensuring type safety throughout the project.
-   **`constants.ts`**: Holds static, initial data for the application, such as the starting list of items, categories, and user profiles.
-   **`services/mockApi.ts`**: **The Simulated Backend**. This crucial file mimics a real server API. It manages the application's "database" (in-memory arrays of items, users, carts, etc.) and exposes functions to interact with this data. It uses `Promise` and `setTimeout` to simulate network latency and asynchronous behavior.

### Component Architecture

The UI is broken down into a series of reusable components located in the `components/` directory.

-   **`App.tsx`**: The root component. It manages all application state (current user, items, cart), handles all primary user interactions (adding to cart, checkout, editing items), and orchestrates which modals are displayed.
-   **`Header.tsx`**: The sticky top navigation bar. It displays the store title, current user information (avatar, balance), and primary action buttons which change based on the user's role.
-   **`SearchBar.tsx`**: Provides the search input and category filter buttons, allowing users to narrow down the displayed items.
-   **`ItemCard.tsx`**: A card component to display a single item. Its appearance and functionality change based on the user's role (e.g., shows "Add to Cart" for users, but "Edit" and "Delete" for admins).
-   **`CartSidebar.tsx`**: A sliding sidebar that displays the contents of the shopping cart, subtotal, and the checkout button.
-   **`TopUpModal.tsx`**: A modal for users to add funds to their wallet.
-   **`InventoryModal.tsx`**: A modal for users to view all the items they have purchased.
-   **`AdminPanelModal.tsx`**: A multi-purpose modal for administrators. It has tabs for adding new items and creating new categories. It also dynamically switches to an "Edit Mode" when an admin chooses to edit an existing item.
-   **`DashboardModal.tsx`**: A data visualization modal for admins, displaying key sales metrics and tables with top-selling items and recent transaction history.
-   **`RoleSwitcher.tsx`**: A simple, fixed UI element that allows for easy toggling between the `user` and `admin` roles for testing purposes.

### Data Flow Example (Adding an item to cart)

1.  **User Action**: The user clicks the "Add to Cart" button on an `ItemCard`.
2.  **Event Trigger**: The `onClick` event on the button calls the `handleAddToCart` function passed down from `App.tsx`.
3.  **API Call**: `handleAddToCart` calls the `api.addToCart(itemId)` function from `services/mockApi.ts`.
4.  **Backend Simulation**: The `mockApi.ts` file finds the item, checks business logic (e.g., does the user already own it?), updates its internal `cart` array, and returns a `Promise` that resolves with the updated cart data.
5.  **State Update**: Back in `App.tsx`, the `.then()` or `await` on the API call completes. The component then updates its local state by calling `setCart(updatedCart)`.
6.  **UI Re-render**: React detects the state change and re-renders any components that depend on the `cart` state, such as the `Header` (to update the cart count) and the `CartSidebar`. The user instantly sees the item appear in their cart.
