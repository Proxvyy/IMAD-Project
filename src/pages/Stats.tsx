import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonLabel,
} from "@ionic/react";
import { ReadingItem } from "../App";

interface StatsProps {
  items: ReadingItem[];
}

const Stats: React.FC<StatsProps> = ({ items }) => {
  const total = items.length;

  // Count by status
  const reading = items.filter((i) => i.status === "Reading").length;
  const completed = items.filter((i) => i.status === "Completed").length;
  const plan = items.filter((i) => i.status === "Plan to Read").length;
  const dropped = items.filter((i) => i.status === "Dropped").length;

  // Count by type
  const byType = {
    Book: items.filter((i) => i.type === "Book").length,
    Manga: items.filter((i) => i.type === "Manga").length,
    Manhwa: items.filter((i) => i.type === "Manhwa").length,
    Manhua: items.filter((i) => i.type === "Manhua").length,
  };

  // Average rating (only for rated items)
  const avgRating =
    total > 0
      ? (items.reduce((sum, i) => sum + i.rating, 0) / total).toFixed(1)
      : "0.0";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Stats</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Stats</IonTitle>
          </IonToolbar>
        </IonHeader>

        {total === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}
          >
            <p>No stats yet. Add some titles first!</p>
          </div>
        ) : (
          <>
            {/* Total count */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle style={{ textAlign: "center" }}>
                  {total} Total Titles
                </IonCardTitle>
              </IonCardHeader>
            </IonCard>

            {/* Status breakdown */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>By Status</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol size="6" style={{ textAlign: "center" }}>
                      <h2
                        style={{
                          color: "#6366f1",
                          margin: "4px 0",
                          fontWeight: 700,
                        }}
                      >
                        {reading}
                      </h2>
                      <p style={{ margin: 0 }}>Reading</p>
                    </IonCol>
                    <IonCol size="6" style={{ textAlign: "center" }}>
                      <h2
                        style={{
                          color: "#10b981",
                          margin: "4px 0",
                          fontWeight: 700,
                        }}
                      >
                        {completed}
                      </h2>
                      <p style={{ margin: 0 }}>Completed</p>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="6" style={{ textAlign: "center" }}>
                      <h2
                        style={{
                          color: "#f59e0b",
                          margin: "4px 0",
                          fontWeight: 700,
                        }}
                      >
                        {plan}
                      </h2>
                      <p style={{ margin: 0 }}>Plan to Read</p>
                    </IonCol>
                    <IonCol size="6" style={{ textAlign: "center" }}>
                      <h2
                        style={{
                          color: "#f43f5e",
                          margin: "4px 0",
                          fontWeight: 700,
                        }}
                      >
                        {dropped}
                      </h2>
                      <p style={{ margin: 0 }}>Dropped</p>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            {/* Type breakdown */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>By Type</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {(Object.keys(byType) as (keyof typeof byType)[]).map(
                  (type) => (
                    <div key={type} style={{ marginBottom: "10px" }}>
                      <IonLabel>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>{type}</span>
                          <span>{byType[type]}</span>
                        </div>
                      </IonLabel>
                      <IonProgressBar
                        value={total > 0 ? byType[type] / total : 0}
                      />
                    </div>
                  ),
                )}
              </IonCardContent>
            </IonCard>

            {/* Average rating */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle style={{ textAlign: "center" }}>
                  ⭐ {avgRating} / 10
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent style={{ textAlign: "center" }}>
                Average Rating
              </IonCardContent>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Stats;
