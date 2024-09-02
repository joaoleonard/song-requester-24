<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click="close">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="title">Encerrar show!</h2>
          <button @click="close" class="btn-close">
            <SvgCloseX />
          </button>
        </div>

        <div class="modal-body">
          <p>Ao encerrar o show, todos os pedidos serão excluídos.<br>Deseja realmente fazer isso?</p>
        </div>

        <slot name="footer">
          <div class="modal-footer">
            <button class="action-button cancel-button" @click="onCancel">
              Cancelar
            </button>
            <button class="action-button" @click="onConfirm">
              Confirmar
            </button>
          </div>
        </slot>
      </div>
    </div>
  </transition>
</template>

<script>
import SvgCloseX from "../SvgCloseX.vue";
export default {
  components: { SvgCloseX },
  name: "DeleteRequestModal",
  methods: {
    close() {
      this.$emit("close");
    },
    onConfirm() {
      this.$emit("confirm");
    },
    onCancel() {
      this.close();
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 37rem;
  max-height: 80%;
  position: relative;
  max-width: 90vw;
}

.title {
  color: #545454;
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: none;
  word-wrap: break-word;
  margin: 0;
  font-family: "Playfair Display", sans-serif;
}

p {
  color: #545454;
  font-weight: 600;
  font-family: "Playfair Display", sans-serif;
  font-size: 1.3rem;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 22.5px 28px 0;
  border-radius: 10px;
}

.modal-body {
  position: relative;
  padding: 0 25px;
}

.btn-close {
  position: absolute;
  top: 10px;
  right: 6px;
  border: none;
  font-size: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #545454;
  background: transparent;
}

.btn-close:hover {
  background-color: transparent;
}

button {
  border: none;
  outline: inherit;
  -webkit-tap-highlight-color: transparent;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px !important;
}

.action-button {
  border: 0;
  border-radius: 0.25em;
  background: initial;
  background-color: #9de19a;
  color: #fff;
  font-size: 1em;
  padding: 0.625em 1.1em;
  display: inline-block;
  font-weight: 500;
}

.action-button:hover {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
}

.action-button:focus {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
}

.cancel-button {
  background-color: #f44;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
