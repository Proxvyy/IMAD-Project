import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { ReadingItem } from "../App";
import TitleForm from "../components/TitleForm";

interface AddTitleProps {
  onAdd: (item: Omit<ReadingItem, "id">) => void;
}

const AddTitle: React.FC<AddTitleProps> = ({ onAdd }) => {
  const history = useHistory();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAdd = (item: Omit<ReadingItem, "id">) => {
    onAdd(item);
    setShowSuccess(true);
    // Go to library after a short delay
    setTimeout(() => history.push("/library"), 1000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add New Title</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Add New Title</IonTitle>
          </IonToolbar>
        </IonHeader>

        <TitleForm submitLabel="Add to Library" onSubmit={handleAdd} />

        <IonToast
          isOpen={showSuccess}
          message="Title added to your library!"
          duration={1500}
          color="success"
          onDidDismiss={() => setShowSuccess(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddTitle;
