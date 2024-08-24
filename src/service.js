import { useCollection } from "vuefire";
import { RequestSong } from "./views/RequestPage.vue";
import { orderBy, query, collection } from "firebase/firestore";
import { db } from "./firebase";

export function dbCollectionsService() {
    const { data: requests, pending, error} = useCollection<RequestSong>(query(collection(db, "requests"), orderBy("createdAt", "desc")), { ssrKey: "requests" });

    return { requests, pending, error };
}