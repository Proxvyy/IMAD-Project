import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonAlert,
  IonSegment,
  IonSegmentButton,
  IonActionSheet,
  IonProgressBar,
  IonModal,
  IonButtons,
} from "@ionic/react";
import {
  trashOutline,
  createOutline,
  closeOutline,
  addOutline,
} from "ionicons/icons";
import { useState } from "react";
import { ReadingItem } from "../App";
import TitleForm from "../components/TitleForm";
import { getStatusColor, STATUSES, TYPES } from "../utils/helpers";

interface LibraryProps {
  items: ReadingItem[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: ReadingItem["status"]) => void;
  onEdit: (item: ReadingItem) => void;
}

const Library: React.FC<LibraryProps> = ({
  items,
  onDelete,
  onStatusChange,
  onEdit,
}) => {
  const [filter, setFilter] = useState<string>("All");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [statusItem, setStatusItem] = useState<ReadingItem | null>(null);
  const [editItem, setEditItem] = useState<ReadingItem | null>(null);

  // Filter items based on the selected type
  const filteredItems =
    filter === "All" ? items : items.filter((i) => i.type === filter);

  // Handle save from the edit form
  const handleSaveEdit = (values: Omit<ReadingItem, "id">) => {
    if (!editItem) return;
    onEdit({ ...editItem, ...values });
    setEditItem(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Library</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Library</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Filter bar */}
        <IonSegment
          value={filter}
          onIonChange={(e) => setFilter(e.detail.value as string)}
          scrollable
        >
          <IonSegmentButton value="All">
            <IonLabel>All</IonLabel>
          </IonSegmentButton>
          {TYPES.map((t) => (
            <IonSegmentButton key={t} value={t}>
              <IonLabel>{t === "Book" ? "Books" : t}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>

        {/* Empty state — different message depending on why it's empty */}
        {filteredItems.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#888",
            }}
          >
            <p>
              {items.length === 0
                ? "No titles yet. Add one from the Add tab!"
                : `No ${filter === "Book" ? "Books" : filter} in your library yet.`}
            </p>
          </div>
        )}

        {/* List */}
        <IonList>
          {filteredItems.map((item) => {
            const progress =
              item.totalChapters > 0 ? item.chapter / item.totalChapters : 0;
            const showProgress = item.status !== "Completed";

            return (
              <IonItem
                key={item.id}
                button
                onClick={() => setStatusItem(item)}
                lines="none"
                style={{ marginBottom: "6px" }}
              >
                <IonLabel>
                  <h2
                    style={{
                      textDecoration:
                        item.status === "Completed" ? "line-through" : "none",
                      fontWeight: 600,
                    }}
                  >
                    {item.title}
                  </h2>
                  <p>
                    {item.type} &middot; Ch. {item.chapter} /{" "}
                    {item.totalChapters} &middot; ⭐ {item.rating}/10
                  </p>
                  {showProgress && (
                    <div style={{ marginTop: "8px", marginRight: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <IonProgressBar
                            value={progress}
                            color={getStatusColor(item.status)}
                          />
                        </div>
                        <IonButton
                          size="small"
                          fill="clear"
                          disabled={item.chapter >= item.totalChapters}
                          onClick={(e) => {
                            e.stopPropagation();
                            const newChapter = item.chapter + 1;
                            onEdit({
                              ...item,
                              chapter: newChapter,
                              // auto-complete when reaching the last chapter
                              status:
                                newChapter >= item.totalChapters
                                  ? "Completed"
                                  : item.status,
                            });
                          }}
                          style={{ margin: 0, height: "24px" }}
                        >
                          <IonIcon
                            icon={addOutline}
                            color="primary"
                            slot="icon-only"
                          />
                        </IonButton>
                      </div>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#6b7280",
                          margin: "4px 0 0 0",
                        }}
                      >
                        {Math.round(progress * 100)}% read
                      </p>
                    </div>
                  )}
                </IonLabel>
                <IonBadge color={getStatusColor(item.status)} slot="end">
                  {item.status}
                </IonBadge>
                <IonButton
                  fill="clear"
                  slot="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditItem(item);
                  }}
                >
                  <IonIcon icon={createOutline} color="primary" />
                </IonButton>
                <IonButton
                  fill="clear"
                  slot="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(item.id);
                  }}
                >
                  <IonIcon icon={trashOutline} color="danger" />
                </IonButton>
              </IonItem>
            );
          })}
        </IonList>

        {/* Delete confirmation alert */}
        <IonAlert
          isOpen={deleteId !== null}
          onDidDismiss={() => setDeleteId(null)}
          header="Delete Title?"
          message="Are you sure you want to delete this title?"
          buttons={[
            { text: "Cancel", role: "cancel" },
            {
              text: "Delete",
              role: "destructive",
              handler: () => {
                if (deleteId !== null) onDelete(deleteId);
              },
            },
          ]}
        />

        {/* Status change action sheet (activity completion) */}
        <IonActionSheet
          isOpen={statusItem !== null}
          onDidDismiss={() => setStatusItem(null)}
          header={statusItem ? `Change status: ${statusItem.title}` : ""}
          buttons={[
            ...STATUSES.map((s) => ({
              text: s,
              handler: () => {
                if (statusItem) onStatusChange(statusItem.id, s);
              },
            })),
            { text: "Cancel", role: "cancel" as const },
          ]}
        />

        {/* Edit modal */}
        <IonModal
          isOpen={editItem !== null}
          onDidDismiss={() => setEditItem(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Title</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setEditItem(null)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            {editItem && (
              <TitleForm
                initialValues={editItem}
                submitLabel="Save Changes"
                onSubmit={handleSaveEdit}
                onCancel={() => setEditItem(null)}
              />
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Library;
