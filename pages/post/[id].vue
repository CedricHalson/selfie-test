<template>
    <q-page>
        <div class="post-details">
            <q-card
                flat
                bordered
            >
                <q-card-section>
                    <div class="text-h3">
                        {{ postStore.post.title }}
                    </div>
                    <div class="text-subtitle text-weight-bold">
                        {{ user.name }}
                    </div>
                    <div class="text-subtitle text-grey">
                        {{ user.email }}
                    </div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                    <p
                        v-for="item in 20"
                        :key="item"
                    >
                        {{ postStore.post.body }}
                    </p>
                </q-card-section>
            </q-card>

            <div class="row q-my-md">
                <div class="col-12 col-sm-6">
                    <div class="text-h5">Comments</div>
                </div>
                <div class="col-12 col-sm-6">
                    <q-input
                        dense
                        outlined
                        label="Search By User"
                        v-model="commentData.input"
                        @update:model-value="onCommentSearch"
                    />
                </div>
            </div>
            <span v-if="commentData.comments.length === 0">
                No comments so far
            </span>
            <div class="post-details__comments">
                <!-- create comment component -->
                <post-comment
                    class="q-mb-md"
                    v-for="comment in commentData.comments"
                    :key="comment.id"
                    :comment="comment"
                />
                <q-inner-loading :showing="commentData.loading">
                    <q-spinner-gears
                        size="50px"
                        color="primary"
                    />
                </q-inner-loading>
                <q-infinite-scroll
                    ref="commentScroll"
                    @load="onCommentsLoad"
                    :offset="50"
                >
                    <template v-slot:loading>
                        <div class="row justify-center q-my-md">
                            <q-spinner-gears
                                size="50px"
                                color="primary"
                            />
                        </div>
                    </template>
                </q-infinite-scroll>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { QInfiniteScroll } from "quasar"
import { UserModel } from "@/models/user-model"
import { CommentModel } from "@/models/comment-model"
import { DataTypeValidator } from "@/util/data-type-validator"

const router = useRouter()
const commentScroll = ref<QInfiniteScroll>()

const postStore = usePostStore()
const userStore = useUserStore()

const postId = computed(() => {
    const val = Number.parseInt(
        router.currentRoute.value.params.id?.toString() ?? "",
    )

    if (Number.isInteger(val)) {
        return val
    }
    return 1
})

await postStore.fetchDetails(postId.value)
if (userStore.list.length === 0) {
    await userStore.fetchList()
}

const user = computed(() => {
    const u = userStore.list.find((el) => el.id === postStore.post.userId)
    return u ?? UserModel.fromJson()
})

const commentData = reactive({
    comments: [] as Array<CommentModel>,
    timeoutId: 0,
    input: "",
    loading: false,
})

const fetchComments = async (user?: string) => {
    const response = (await $fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId.value}/comments`,
        {
            query: {
                name_like: user || undefined,
            },
        },
    ).catch((msg) => {
        console.warn("Failed to load comments", DataTypeValidator.string(msg))
    })) as Array<Record<string, any>>

    return Promise.resolve(response)
}

const onCommentsLoaded = (data: Array<Record<string, any>>) => {
    commentData.comments = DataTypeValidator.list(data).map((el) =>
        CommentModel.fromJson(el),
    )
}

const onCommentsLoad = async (index: number, done: Function) => {
    const response = await fetchComments()

    setTimeout(() => {
        onCommentsLoaded(response)
        done()
        commentScroll.value?.stop()
    }, 2000)
}

const onCommentSearch = () => {
    if (commentData.timeoutId !== 0) {
        window.clearTimeout(commentData.timeoutId)
    }
    commentData.timeoutId = window.setTimeout(async () => {
        commentData.loading = true
        const response = await fetchComments(commentData.input)
        commentData.loading = false
        onCommentsLoaded(response)
    }, 1000)
}
</script>

<style lang="sass">
.post-details
    width: 100%
    max-width: 800px
    padding: 16px
    margin: 0 auto

.post-details__comments
    position: relative
</style>
