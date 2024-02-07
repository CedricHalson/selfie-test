<template>
    <q-card class="post-comment">
        <q-card-section>
            <div class="text-body text-weight-bold">
                {{ props.comment.name }}
            </div>
            <div class="text-body text-grey">
                {{ props.comment.email }}
            </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
            <div class="text-body2">
                {{ props.comment.body }}
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { CommentModel } from "@/models/comment-model"

const props = defineProps({
    comment: {
        type: Object as () => CommentModel,
        default: () => CommentModel.fromJson(),
    },
})
</script>
