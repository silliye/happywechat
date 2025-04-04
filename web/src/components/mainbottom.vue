<template>
    <div class="bottom-nav">
      <div class="nav-item">
        <img src="../assets/img/main-chat.png" class="nav-icon" />
      </div>
      <div class="nav-item">
        <img src="../assets/img/main-contacts.png" class="nav-icon" />
      </div>
      <div class="nav-item">
        <img src="../assets/img/main-discover.png" class="nav-icon" />
      </div>
      <div class="nav-item">
        <img src="../assets/img/main-me.png" class="nav-icon" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "BottomNav",
  };
  </script>
  
  <style scoped>
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #f7f7f7;
    padding: 10px 0;
    border-top: 1px solid #ddd;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .nav-icon {
    width: 55px;
    height: 45px;
  }
  </style>
  