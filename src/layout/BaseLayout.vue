<template>
  <header>
    <h1>João & Leticia</h1>
  </header>
  <main>
    <slot name="body" />
  </main>
  <footer v-show="!admin">Música para casamentos, restaurantes e eventos em geral</footer>
  <slot name="modals" />
</template>

<script>
export default {
  name: "BaseLayout",
  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      themeColor: this.admin ? "#74c476" : "#4b3c05",
    };
  },
};
</script>

<style scoped>
header,
footer {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: v-bind(themeColor);
  width: 100vw;
  margin: 0;
  left: 0;
  color: #fff;
}

header {
  top: 0;
}

h1 {
  font-size: 25px;
  font-family: "Playfair Display", sans-serif;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  margin-top: 3rem;
  padding-bottom: 75px;
}

footer {
  bottom: 0;
  font-family: "Playfair Display", sans-serif;
  position: fixed;
}
</style>
