<template>
  <BaseLayout>
    <template #body>
      <div v-if="!musicianData || loading">
        <p>Carregando...</p>
      </div>
      <template v-else-if="allMusicians && !musicianIsLive">
        <h1>O show já vai começar!</h1>
        <p>Enquanto isso, nos siga nas redes sociais<br>para não perder nada</p>
        <InstagramCard @click="goToInstagram"/>
      </template>
      <template v-else>
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
      <GetUserNameModal v-show="showGetUserNameModal" @confirm="getUserName" />
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
import GetUserNameModal from "../components/modals/GetUserNameModal.vue";
import { toRaw } from "vue";
import InstagramCard from "../components/InstagramCard.vue";

export default {
  components: {
    RequestItem,
    AddRequestModal,
    DeleteRequestModal,
    BaseLayout,
    GetUserNameModal,
    InstagramCard
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
      allMusicians: useCollection(query(collection(db, "musicians")), {
        ssrKey: "musicians",
      }),
    };
  },
  computed: {
    songsRequested() {
      return this.requestsCollection;
    },
    musicianData() {
      return toRaw(this.allMusicians.filter((musician) => musician.id === "Xt6beIx05Q6nFzpREY9q")[0]);
    },
    musicianIsLive() {
      return this.musicianData.is_live;
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
    goToInstagram() {
      window.open("https://www.instagram.com/joaoeleticiamusica/");
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
