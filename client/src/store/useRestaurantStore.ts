import { Orders } from "@/types/orderType";
import { MenuItem, RestaurantState, searchedRestaurant } from "@/types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "https://restaurant-1-gitf.onrender.com/api/v1/restaurant";
axios.defaults.withCredentials = true;

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      loading: false,
      restaurant: null,
      searchedRestaurants: { data: [] } as searchedRestaurant,
      appliedFilter: [],
      singleRestaurant: null,
      restaurantOrder: [],

      // Create restaurant
      createRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData);

          if (response.data?.success) {
            toast.success(response.data.message);
            set({ loading: false, restaurant: response.data?.data ?? null });
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Something went wrong");
          set({ loading: false });
        }
      },

      // Get restaurant
      getRestaurant: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          set({
            loading: false,
            restaurant: response.data?.data ?? null,
          });
        } catch (error: any) {
          set({ restaurant: null, loading: false });
        }
      },

      // Update restaurant
      updateRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(`${API_END_POINT}/`, formData);

          if (response.data?.success) {
            toast.success(response.data.message);
            set({ loading: false, restaurant: response.data?.data ?? null });
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Something went wrong");
          set({ loading: false });
        }
      },

      // Search restaurants
      searchRestaurant: async (
        searchText: string,
        searchQuery: string,
        selectedCuisines: string[]
      ) => {
        try {
          set({ loading: true });
          const params = new URLSearchParams();
          params.set("searchQuery", searchQuery);
          params.set("selectedCuisines", selectedCuisines.join(","));

          const response = await axios.get(
            `${API_END_POINT}/search/${searchText}?${params.toString()}`
          );

          set({ loading: false, searchedRestaurants: { data: response.data?.data ?? [] } });
        } catch (error) {
          set({ loading: false, searchedRestaurants: { data: [] } });
        }
      },

      // Add menu item to restaurant
      addMenuToRestaurant: (menu: MenuItem) => {
        set((state: any) => ({
          restaurant: state.restaurant
            ? { ...state.restaurant, menus: [...(state.restaurant.menus ?? []), menu] }
            : null,
        }));
      },

      // Update menu item
      updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state: any) => {
          if (state.restaurant?.menus) {
            const updatedMenuList = state.restaurant.menus.map((menu: any) =>
              menu._id === updatedMenu._id ? updatedMenu : menu
            );
            return { restaurant: { ...state.restaurant, menus: updatedMenuList } };
          }
          return state;
        });
      },

      // Filters
      setAppliedFilter: (value: string) => {
        set((state) => {
          const isAlreadyApplied = state.appliedFilter.includes(value);
          const updatedFilter = isAlreadyApplied
            ? state.appliedFilter.filter((item) => item !== value)
            : [...state.appliedFilter, value];
          return { appliedFilter: updatedFilter };
        });
      },

      resetAppliedFilter: () => {
        set({ appliedFilter: [] });
      },

      // Get single restaurant
      getSingleRestaurant: async (restaurantId: string) => {
        try {
          const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
          set({ singleRestaurant: response.data?.data ?? null });
        } catch (error) {
          set({ singleRestaurant: null });
        }
      },

      // Get restaurant orders
      getRestaurantOrders: async () => {
        try {
          const response = await axios.get(`${API_END_POINT}/order`);
          set({ restaurantOrder: response.data?.data ?? [] });
        } catch (error) {
          set({ restaurantOrder: [] });
        }
      },

      // Update order status
      updateRestaurantOrders: async (orderId: string, status: string) => {
        try {
          const response = await axios.put(
            `${API_END_POINT}/order/${orderId}/status`,
            { status },
            { headers: { "Content-Type": "application/json" } }
          );
          if (response.data?.success) {
            const updatedOrder = get().restaurantOrder.map((order: Orders) =>
              order._id === orderId ? { ...order, status: response.data?.data?.status ?? status } : order
            );
            set({ restaurantOrder: updatedOrder });
            toast.success(response.data?.message || "Order updated");
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Something went wrong");
        }
      },
    }),
    {
      name: "restaurant-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
