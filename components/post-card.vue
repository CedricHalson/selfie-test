<template>
    <q-card
        class="post-card"
        bordered
    >
        <q-card-section>
            <div class="text-h5">{{ props.post.title }}</div>
            <div class="text-subtitle text-grey">by {{ props.user.name }}</div>
        </q-card-section>
        <q-card-section class="post-card__body">
            {{ props.post.body }}
        </q-card-section>
        <q-separator />
        <q-card-actions>
            <q-space />
            <nuxt-link class="link" :to="`/post/${props.post.id}`" >Learn more </nuxt-link>
        </q-card-actions>
    </q-card>
</template>

<script setup lang="ts">
import { PostModel } from "@/models/post-model"
import { UserModel } from "@/models/user-model"

const props = defineProps({
    post: {
        type: Object as () => PostModel,
        default: () => PostModel.fromJson(),
    },

    user: {
        type: Object as () => UserModel,
        default: () => UserModel.fromJson(),
    },
})
</script>

<style lang="sass">
.post-card
    height: 100%

    display: flex
    flex-direction: column

.post-card__body
    flex-grow: 1
</style>
