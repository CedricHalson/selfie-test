import { defineStore } from "pinia"
import { PostModel } from "@/models/post-model"
import { DataTypeValidator } from "~/util/data-type-validator"

export const usePostStore = defineStore("postStore", () => {
    const loading = ref(false)
    const error = ref("")
    const _list = ref<Array<Record<string, any>>>([])
    const list = computed<Array<PostModel>>(() =>
        _list.value.map((el) => PostModel.fromJson(el)),
    )

    const _post = ref<Record<string, any>>({})
    const post = computed(() => PostModel.fromJson(_post.value))

    const fetchInitialList = async (
        page: number,
        limit: number,
        search?: string,
        sort?: string,
    ) => {
        loading.value = true
        error.value = ""
        const response = await useFetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                query: {
                    _page: page,
                    _limit: limit,
                    title_like: search,
                    sort: sort,
                },
            },
        )
        _list.value.splice(0)
        if (response.status.value === "success") {
            _list.value.push(
                ...Array.from(
                    response.data.value as Iterable<Record<string, any>>,
                ).map((el) => PostModel.fromJson(el).toJson()),
            )
        } else {
            error.value =
                response.error.value?.message ?? "Something went wrong"
        }
        loading.value = false
        return Promise.resolve(response)
    }

    const fetchList = async (
        page: number,
        limit: number,
        search?: string,
        sort?: string,
    ) => {
        loading.value = true
        error.value = ""
        const response = (await $fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                query: {
                    _page: page,
                    _limit: limit,
                    title_like: search || undefined,
                    _sort: sort || undefined,
                },
            },
        ).catch((msg) => {
            error.value = DataTypeValidator.string(msg)
        })) as Array<Record<string, any>>
        _list.value.splice(0)
        if (Array.isArray(response)) {
            _list.value.push(
                ...Array.from(response).map((el) =>
                    PostModel.fromJson(el).toJson(),
                ),
            )
        }
        loading.value = false
        return Promise.resolve(response)
    }

    const fetchDetails = async (id: number) => {
        loading.value = true
        const response = await useFetch(
            `https://jsonplaceholder.typicode.com/posts/${id}`,
        )
        _post.value = {}

        if (response.status.value === "success") {
            _post.value = PostModel.fromJson(
                response.data.value as Record<string, any>,
            ).toJson()
        }
        loading.value = false
        return Promise.resolve(response)
    }

    return {
        fetchInitialList,
        fetchList,
        fetchDetails,
        list,
        post,
        loading,
        error,
    }
})
