<template>
  <div class="instagram-card">
    <div class="instagram-card__header">
      <img
        class="instagram-card__profile-pic"
        src="../assets/profile_pic.jpg"
        alt="Profile picture"
      />
      <div class="instagram-card__username">joaoeleticiamusica</div>
    </div>
    <img
      class="instagram-card__image"
      src="../assets/instagram_pic.jpg"
      alt="Instagram post"
    />
    <div class="instagram-card__footer">
      <div class="post-info">
        <div style="display: flex">
          <div class="likes">
            <i class="pi pi-heart-fill" style="font-size: 1.5rem"></i> 712
          </div>
          <div class="comments">
            <i class="pi pi-comment" style="font-size: 1.5rem"></i> 53
          </div>
          <div class="send">
            <i class="pi pi-send" style="font-size: 1.5rem"></i>
          </div>
        </div>
        <div class="save">
          <i class="pi pi-bookmark-fill" style="font-size: 1.5rem"></i>
        </div>
      </div>
      <div class="instagram-card__caption">
        <span>A trilha sonora perfeita para seu casamento e evento ✨🎶</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InstagramCard",
};
</script>

<style>
.instagram-card {
  border: 1px solid #eaeaea;
  border-radius: 18px;
  margin-bottom: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.instagram-card__header {
  display: flex;
  align-items: center;
  padding: 10px;
}

.instagram-card__profile-pic {
  object-fit: cover;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin-right: 10px;
}

.instagram-card__username {
  font-family: "Helvetica Neue", sans-serif;
  font-weight: bold;
}

.instagram-card__image {
  object-fit: cover;
  width: 90vw;
  height: 25rem;
}

.instagram-card__footer {
  margin-bottom: 10px;
}

.post-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.likes,
.comments,
.send,
.save {
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 5px;
}

.instagram-card__caption {
  font-size: 1rem;
  text-align: left;
  padding: 10px;
  padding-top: 0;
  max-width: 84vw;
}
</style>
