<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Tab'
      },
      indexId: {
        type: String
      },
    },
    computed: {
        isActive() {
          return this.selectedIndex() === this.indexId;
        },
    },
    inject: {
        getTabs: {
            from: '$_searchTabs_getTabs',
            default: () => {
                throw new Error('SearchTabs must be used inside SearchTabs component');
            }
        },
        selectedIndex: {
            from: 'selectedIndex',
            default: () => {}
        },
    },
    created() {
        this.getTabs().push(this);
    }
  }
</script>