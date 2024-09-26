<template>
  <BaseLayout>
    <template #body>
      <div v-if="!musicianData || loading">
        <p>Carregando...</p>
      </div>
      <template v-else-if="allMusicians && !musicianIsLive">
        <h1>O show já vai começar!</h1>
        <p>
          Enquanto isso, nos siga nas redes sociais<br />para não perder nada
        </p>
        <InstagramCard @click="goToInstagram" />
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
        <div style="width: 90%">
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

      <div class="contacts" v-if="!admin">
        <div class="divider" />
        <p class="contact-text">Contatos</p>
        <div class="contact" @click="goToWhatsapp">
          <i class="pi pi-whatsapp" style="font-size: 1.5rem"></i>
          <p class="contact-info">(43) 9 9950-8659</p>
        </div>
        <div class="contact" @click="goToInstagram">
          <i class="pi pi-instagram" style="font-size: 1.5rem"></i>
          <p class="contact-info">@joaoeleticiamusica</p>
        </div>
        <div class="contact">
          <i class="pi pi-envelope" style="font-size: 1.5rem"></i>
          <p class="contact-info">joaoeleticiamusica@gmail.com</p>
        </div>
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
import { goToInstagram } from "../utils/index.js";

export default {
  components: {
    RequestItem,
    AddRequestModal,
    DeleteRequestModal,
    BaseLayout,
    GetUserNameModal,
    InstagramCard,
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
      return toRaw(
        this.allMusicians.filter(
          (musician) => musician.id === "Xt6beIx05Q6nFzpREY9q"
        )[0]
      );
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
      goToInstagram();
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


.contacts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 20px;
  bottom: 0;
  left: 0;
  margin-top: auto;
}

.contact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.contact-text {
  font-family: "Playfair Display", sans-serif;
  font-size: 1.5rem;
  margin: 10px;
  font-weight: 500;
}

.contact-info {
  font-family: "Helvetica Neue", sans-serif;
  font-size: 1.2rem;
  margin: 5px;
  font-weight: 500;
}

.divider {
  width: 90%;
  height: 1px;
  background-color: #eaeaea;
  margin-top: 20px;
}

button,
input {
  border: none;
  outline: inherit;
  -webkit-tap-highlight-color: transparent;
}
</style>
