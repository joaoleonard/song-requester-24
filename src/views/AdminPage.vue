<template>
  <BaseLayout :admin="true">
    <template #body>
      <button
        class="open-modal-request-button"
        type="submit"
        @click="clearCollection"
        v-if="!loading"
      >
        Encerrar show
      </button>
      <div style="width: 90%; padding-bottom: 70px">
        <div v-if="loading" class="loading">
          <p>Carregando...</p>
        </div>
        <div v-else-if="!loading && songsRequested.length">
          <p>Lista de pedidos</p>
          <RequestItem
            v-for="(song, index) in songsRequested"
            :key="song.id"
            :songRequest="song"
            :orderNumber="index + 1"
            @click="openChangeStatusModal(song.id)"
          />
        </div>
        <p v-else>Nenhum pedido de música ainda</p>
      </div>
    </template>
    <template #modals>
      <ChangeStatusModal
        v-show="showChangeStatusModal"
        @close="closeChangeStatusModal"
        @confirm="attendRequest"
        @cancel="refuseRequest"
        @delete="deleteSongRequest"
      />
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from "../layout/BaseLayout.vue";
import { db } from "../firebase.js";
import {
  orderBy,
  query,
  deleteDoc,
  doc,
  collection,
  updateDoc,
} from "firebase/firestore";
import RequestItem from "../components/RequestItem.vue";
import AddRequestModal from "../components/modals/AddRequestModal.vue";
import DeleteRequestModal from "../components/modals/DeleteRequestModal.vue";
import ChangeStatusModal from "../components/modals/ChangeStatusModal.vue";
import { useCollection } from "vuefire";

export default {
  components: {
    RequestItem,
    AddRequestModal,
    DeleteRequestModal,
    BaseLayout,
    ChangeStatusModal,
  },
  name: "AdminPage",
  data() {
    return {
      showChangeStatusModal: false,
      songSelected: "",
      loading: false,
      requestsCollection: useCollection(
        query(collection(db, "requests"), orderBy("created_at", "asc")),
        { ssrKey: "requests" }
      ),
    };
  },
  computed: {
    songsRequested() {
      return this.requestsCollection;
    },
    songsLength() {
      return this.songsRequested.length;
    },
  },
  watch: {
    songsLength() {
      console.log("alguém botou uma música nova");
    },
  },
  methods: {
    openChangeStatusModal(songRequestedId) {
      this.showChangeStatusModal = true;
      this.songSelected = songRequestedId;
    },
    closeChangeStatusModal() {
      this.showChangeStatusModal = false;
    },
    async attendRequest() {
      this.closeChangeStatusModal();
      this.loading = true;

      await updateDoc(doc(db, "requests", this.songSelected), {
        status: "attended",
      }).finally(() => (this.loading = false));
    },
    async refuseRequest() {
      this.closeChangeStatusModal();
      this.loading = true;

      await updateDoc(doc(db, "requests", this.songSelected), {
        status: "refused",
      }).finally(() => (this.loading = false));
    },
    async deleteSongRequest() {
      this.closeChangeStatusModal();
      this.loading = true;

      await deleteDoc(doc(db, "requests", this.songSelected)).finally(
        () => (this.loading = false)
      );
    },
    async clearCollection() {
      this.loading = true;

      const totalSongs = this.songsLength;

      for (let i = totalSongs - 1; i >= 0; i--) {
        const song = this.songsRequested[i];
        await deleteDoc(doc(db, "requests", song.id));
      }

      this.loading = false;
    },
  },
};
</script>

<style scoped>
p {
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: 600;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.open-modal-request-button {
  background-color: #aaa;
  color: #fff;
  -webkit-tap-highlight-color: transparent;
  font-size: 1.3rem;
  width: 80%;
}

button,
input {
  border: none;
  outline: inherit;
  -webkit-tap-highlight-color: transparent;
}
</style>
