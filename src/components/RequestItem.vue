<template>
  <div :class="songRequest.status">
    <p>{{ songRequest.song_artist }}</p>
    <p>{{ songRequest.user_name }}</p>
  </div>
</template>

<script>
export default {
  name: "RequestItem",
  props: {
    songRequest: Object,
    orderNumber: Number,
  },
};
</script>

<style scoped>
div {
  padding: 15px 20px;
  display: flex;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

p {
  color: #4b3c05;
  font-weight: 600;
  margin: 0;
}

.refused {
  background-color: #f8c2c6;
}

.attended {
  background-color: #ade9ce;
}

.pending {
  background-color: #e9e9e9;
}
</style>
