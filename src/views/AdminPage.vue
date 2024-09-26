<template>
  <BaseLayout :admin="true">
    <template #body>
      <div v-if="!musicianData || loading">
        <p>Carregando...</p>
      </div>
      <template v-else-if="musicianData && !isLive">
        <h1>Seu show ainda não está ativo!</h1>
        <p>Clique no botão abaixo para começar</p>
        <button
          class="start-show-button"
          type="submit"
          @click="handleStartShow"
        >
          Iniciar show
        </button>
      </template>
      <template v-else>
        <button
          class="open-modal-request-button"
          type="submit"
          @click="() => (showEndShowModal = true)"
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
              @click="openChangeStatusModal(song)"
            />
          </div>
          <p v-else>Nenhum pedido de música ainda</p>
        </div>
      </template>
    </template>
    <template #modals>
      <ChangeStatusModal
        v-show="showChangeStatusModal"
        @close="closeChangeStatusModal"
        @confirm="attendRequest"
        @cancel="refuseRequest"
        @delete="deleteSongRequest"
        :songSelected="songSelected"
      />
      <EndShowModal
        v-show="showEndShowModal"
        @close="() => (showEndShowModal = false)"
        @confirm="endShow"
        @cancel="() => (showEndShowModal = false)"
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
  where,
} from "firebase/firestore";
import RequestItem from "../components/RequestItem.vue";
import AddRequestModal from "../components/modals/AddRequestModal.vue";
import DeleteRequestModal from "../components/modals/DeleteRequestModal.vue";
import ChangeStatusModal from "../components/modals/ChangeStatusModal.vue";
import { useCollection } from "vuefire";
import EndShowModal from "../components/modals/EndShowModal.vue";
import { toRaw } from "vue";

export default {
  components: {
    RequestItem,
    AddRequestModal,
    DeleteRequestModal,
    BaseLayout,
    ChangeStatusModal,
    EndShowModal
  },
  name: "AdminPage",
  data() {
    return {
      showChangeStatusModal: false,
      showEndShowModal: false,
      songSelected: {},
      loading: false,
      requestsCollection: useCollection(
        query(collection(db, "requests"), orderBy("created_at", "desc")),
        { ssrKey: "requests" }
      ),
      allMusicians: useCollection(
        query(collection(db, "musicians")),
        { ssrKey: "musicians" }
      ),
    };
  },
  computed: {
    songsRequested() {
      return this.requestsCollection;
    },
    musicianData() {
      return toRaw(this.allMusicians.filter((musician) => musician.id === "Xt6beIx05Q6nFzpREY9q")[0]);
    },
    isLive() {
      return this.musicianData.is_live;
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
    async handleStartShow() {
      this.loading = true;

      await updateDoc(doc(db, "musicians", this.musicianData.id), {
        is_live: true,
      }).finally(() => (this.loading = false));
    },
    openChangeStatusModal(songRequested) {
      this.showChangeStatusModal = true;
      this.songSelected = songRequested;
    },
    closeChangeStatusModal() {
      this.showChangeStatusModal = false;
    },
    async attendRequest() {
      this.closeChangeStatusModal();
      this.loading = true;

      await updateDoc(doc(db, "requests", this.songSelected.id), {
        status: "attended",
      }).finally(() => (this.loading = false));
    },
    async refuseRequest() {
      this.closeChangeStatusModal();
      this.loading = true;

      await updateDoc(doc(db, "requests", this.songSelected.id), {
        status: "refused",
      }).finally(() => (this.loading = false));
    },
    async deleteSongRequest() {
      this.closeChangeStatusModal();
      this.loading = true;

      await deleteDoc(doc(db, "requests", this.songSelected.id)).finally(
        () => (this.loading = false)
      );
    },
    async clearCollection() {
      this.showEndShowModal = false;
      this.loading = true;

      const totalSongs = this.songsLength;

      for (let i = totalSongs - 1; i >= 0; i--) {
        const song = this.songsRequested[i];
        await deleteDoc(doc(db, "requests", song.id));
      }

      this.loading = false;
    },
    async endShow() {
      this.loading = true;

      await updateDoc(doc(db, "musicians", this.musicianData.id), {
        is_live: false,
      }).finally(() => {
        this.clearCollection();
      });
    },
  },
};
</script>

<style scoped>
h1 {
  font-family: "Playfair Display", sans-serif;
  font-size: 2rem;
  margin-top: 0;
}

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

.open-modal-request-button, .start-show-button {
  background-color: #aaa;
  color: #fff;
  -webkit-tap-highlight-color: transparent;
  font-size: 1.3rem;
  width: 80%;
}

.start-show-button {
  background-color: #74c476
}

button,
input {
  border: none;
  outline: inherit;
  -webkit-tap-highlight-color: transparent;
}
</style>
