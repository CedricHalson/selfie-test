<template>
    <q-page class="q-px-md">
        <div class="text-h3 q-my-md">STD Posts</div>
        <div class="row q-mb-md q-col-gutter-md">
            <div class="col-12 col-sm-6">
                <q-input
                    outlined
                    dense
                    label="Search"
                    v-model="searchData.input"
                    @update:model-value="onSearch"
                />
            </div>
            <div class="col-12 col-sm-6">
                <q-select
                    outlined
                    dense
                    emit-value
                    map-options
                    label="Sort By"
                    :model-value="sortBy"
                    :options="sortByOptions"
                    @update:model-value="onSort"
                />
            </div>
        </div>
        <q-banner
            class="text-white bg-red"
            v-if="postStore.error.length > 0"
        >
            {{ postStore.error }}
        </q-banner>
        <div class="blog-posts row q-col-gutter-md">
            <div
                class="col-12 col-sm-6 col-md-4"
                v-for="post in postStore.list"
                :key="post.id"
            >
                <post-card
                    :post="post"
                    :user="getUserOfPost(post.userId)"
                />
            </div>
            <q-inner-loading :showing="postStore.loading">
                <q-spinner-gears
                    size="50px"
                    color="primary"
                />
            </q-inner-loading>
        </div>
        <div class="blog-pagination q-my-lg">
            <q-select
                dense
                outlined
                label="Show"
                :model-value="limit"
                :options="limitOptions"
                @update:model-value="onLimitUpdate"
            />
            <q-pagination
                direction-links
                :model-value="page"
                :max="pageCount"
                :max-pages="5"
                @update:model-value="onPageClick"
            />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue"

import { UserModel } from "@/models/user-model"

const postStore = usePostStore()
const userStore = useUserStore()

const router = useRouter()

const searchData = reactive({
    timeoutId: 0,
    input: "",
})

const page = computed(() => {
    const page = Number.parseInt(
        router.currentRoute.value.query.page?.toString() ?? "",
    )

    if (Number.isInteger(page)) {
        return page
    }
    return 1
})

const limit = computed(() => {
    if (search.value) {
        return 50
    }
    const val = Number.parseInt(
        router.currentRoute.value.query.limit?.toString() ?? "",
    )

    if (Number.isInteger(val)) {
        return val
    }
    return 10
})

const limitOptions = computed(() => [5, 10, 25, 50])

const pageCount = computed(() => {
    if (search.value) {
        return 1
    }
    return 100 / limit.value
})

const search = computed(() => {
    return router.currentRoute.value.query.s?.toString() ?? ""
})

const sortBy = computed(() => {
    return router.currentRoute.value.query.sort?.toString() ?? ""
})

const sortByOptions = computed(() => {
    return [
        {
            label: "None",
            value: "",
        },
        {
            label: "Title",
            value: "title",
        },
    ]
})

await postStore.fetchInitialList(page.value, limit.value, search.value)
if (userStore.list.length === 0) {
    await userStore.fetchList()
}

const fetchPostList = (
    page: number,
    limit: number,
    search?: string,
    sort?: string,
) => {
    postStore.fetchList(page, limit, search, sort)
}

const getUserOfPost = (userId: number): UserModel => {
    const user = userStore.list.find((el) => el.id === userId)
    return user ?? UserModel.fromJson()
}

const onSearch = () => {
    if (searchData.timeoutId !== 0) {
        window.clearTimeout(searchData.timeoutId)
    }
    searchData.timeoutId = window.setTimeout(() => {
        const query = searchData.input.length > 0 ? searchData.input : undefined
        router.push({
            path: router.currentRoute.value.path,
            query: {
                ...router.currentRoute.value.query,
                page: 1,
                s: query,
            },
        })
        setTimeout(() => {
            fetchPostList(1, limit.value, query, sortBy.value)
        }, 10)
    }, 1000)
}

const onSort = (val: string) => {
    router.push({
        path: router.currentRoute.value.path,
        query: {
            ...router.currentRoute.value.query,
            page: 1,
            sort: val || undefined,
        },
    })

    setTimeout(() => {
        fetchPostList(1, limit.value, search.value, val)
    }, 10)
}

const onPageClick = (val: number) => {
    router.push({
        path: router.currentRoute.value.path,
        query: {
            ...router.currentRoute.value.query,
            page: val,
        },
    })

    setTimeout(() => {
        fetchPostList(val, limit.value, search.value, sortBy.value)
    }, 10)
}

const onLimitUpdate = (val: number) => {
    router.push({
        path: router.currentRoute.value.path,
        query: {
            page: 1,
            limit: val,
        },
    })

    setTimeout(() => {
        fetchPostList(page.value, val, search.value, sortBy.value)
    }, 10)
}

onMounted(() => {
    if (search.value) {
        searchData.input = search.value.toString()
    }
})
</script>

<style lang="sass">
.blog-posts
    min-height: 500px


.blog-pagination
    display: flex
    justify-content: flex-end
    align-items: center
    gap: 16px

    .q-select
        width: 100px
</style>
