<template>
  <BaseLayout>
    <template #body>
      <button
        class="open-modal-request-button"
        type="submit"
        @click="openAddRequestModal"
        v-if="!loading"
      >
        Fazer pedido
      </button>
      <div style="width: 90%; padding-bottom: 70px">
        <div v-if="loading" class="loading">
          <p>Carregando...</p>
        </div>
        <div v-else-if="songsRequested.length">
          <p>Lista de pedidos</p>
          <RequestItem
            v-for="(song, index) in songsRequested"
            :key="song.id"
            :songRequest="song"
            :orderNumber="index + 1"
            @click="openDeleteRequestModal(song.id)"
          />
        </div>
        <p v-else>Você ainda não fez nenhum pedido</p>
      </div>
    </template>
    
    <template #modals>
      <AddRequestModal
        v-show="showAddRequestModal"
        @close="closeAddRequestModal"
        @confirm="addSongRequest"
      />
      <DeleteRequestModal
        v-show="showDeleteRequestModal"
        @close="closeDeleteRequestModal"
        @confirm="deleteSongRequest"
      />
      <GetUserNameModal
        v-show="showGetUserNameModal"
        @confirm="getUserName"
        />
    </template>
  </BaseLayout>
</template>

<script>
import { db } from "../firebase.js";
import {
  addDoc,
  orderBy,
  query,
  deleteDoc,
  doc,
  collection,
} from "firebase/firestore";
import RequestItem from "../components/RequestItem.vue";
import AddRequestModal from "../components/modals/AddRequestModal.vue";
import DeleteRequestModal from "../components/modals/DeleteRequestModal.vue";
import { useCollection } from "vuefire";
import BaseLayout from "../layout/BaseLayout.vue";
import GetUserNameModal from '../components/modals/GetUserNameModal.vue';

export default {
  components: {
    RequestItem,
    AddRequestModal,
    DeleteRequestModal,
    BaseLayout,
    GetUserNameModal,
  },
  name: "RequestPage",
  data() {
    return {
      showAddRequestModal: false,
      showDeleteRequestModal: false,
      showGetUserNameModal: false,
      songSelected: "",
      loading: false,
      requestsCollection: useCollection(
        query(collection(db, "requests"), orderBy("created_at", "desc")),
        { ssrKey: "requests" }
      ),
    };
  },
  computed: {
    songsRequested() {
      return this.requestsCollection;
    },
  },
  mounted() {
    if (!localStorage.getItem("userName")) {
      this.showGetUserNameModal = true;
    }
  },
  methods: {
    openAddRequestModal() {
      this.showAddRequestModal = true;
    },
    closeAddRequestModal() {
      this.showAddRequestModal = false;
    },
    openDeleteRequestModal(songRequestedId) {
      // this.showDeleteRequestModal = true;
      // this.songSelected = songRequestedId;
    },
    closeDeleteRequestModal() {
      this.showDeleteRequestModal = false;
    },
    addSongRequest(songRequested, songRequestedComment) {
      this.closeAddRequestModal();

      this.loading = true;

      addDoc(collection(db, "requests"), {
        user_id: 1,
        user_name: localStorage.getItem("userName") || "",
        song_artist: songRequested,
        song_comment: songRequestedComment,
        status: "pending",
        created_at: new Date(),
      }).then(() => (this.loading = false));
    },
    async deleteSongRequest() {
      this.closeDeleteRequestModal();
      this.loading = true;

      await deleteDoc(doc(db, "requests", this.songSelected))
        .then(() => (this.loading = false))
        .catch(() => (this.loading = false));
    },
    getUserName(userName) {
      localStorage.setItem("userName", userName);

      this.showGetUserNameModal = false;
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

.input-container {
  width: 100%;
  display: flex;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

input {
  border: none;
  border-bottom: 1px solid #aaa;
  -webkit-appearance: none;
  outline: none;
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
