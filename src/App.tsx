import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { library, addCircle, statsChart } from "ionicons/icons";
import { useState, useEffect } from "react";

import Library from "./pages/Library";
import AddTitle from "./pages/AddTitle";
import Stats from "./pages/Stats";

/* Core CSS required for Ionic components */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";

setupIonicReact();

// The shape of a reading item
export interface ReadingItem {
  id: number;
  title: string;
  type: "Book" | "Manga" | "Manhwa" | "Manhua";
  chapter: number;
  totalChapters: number;
  status: "Reading" | "Completed" | "Plan to Read" | "Dropped";
  rating: number;
}

const STORAGE_KEY = "myreadlist_items";

const App: React.FC = () => {
  // Load saved items from localStorage on first render
  const [items, setItems] = useState<ReadingItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage every time items change (data persistence)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Add a new item
  const addItem = (item: Omit<ReadingItem, "id">) => {
    const newItem: ReadingItem = { ...item, id: Date.now() };
    setItems([...items, newItem]);
  };

  // Delete an item by id
  const deleteItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  // Update an item's status (for activity completion)
  const updateStatus = (id: number, status: ReadingItem["status"]) => {
    setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  // Update an entire item (for the edit feature)
  const updateItem = (updated: ReadingItem) => {
    setItems(items.map((i) => (i.id === updated.id ? updated : i)));
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/library">
              <Library
                items={items}
                onDelete={deleteItem}
                onStatusChange={updateStatus}
                onEdit={updateItem}
              />
            </Route>
            <Route exact path="/add">
              <AddTitle onAdd={addItem} />
            </Route>
            <Route exact path="/stats">
              <Stats items={items} />
            </Route>
            <Route exact path="/">
              <Redirect to="/library" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="library" href="/library">
              <IonIcon aria-hidden="true" icon={library} />
              <IonLabel>Library</IonLabel>
            </IonTabButton>
            <IonTabButton tab="add" href="/add">
              <IonIcon aria-hidden="true" icon={addCircle} />
              <IonLabel>Add</IonLabel>
            </IonTabButton>
            <IonTabButton tab="stats" href="/stats">
              <IonIcon aria-hidden="true" icon={statsChart} />
              <IonLabel>Stats</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
