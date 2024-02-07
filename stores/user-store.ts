import { defineStore } from "pinia"
import { UserModel } from "~/models/user-model"

export const useUserStore = defineStore("userStore", () => {
    const _list = ref<Array<Record<string, any>>>([])
    const list = computed<Array<UserModel>>(() =>
        _list.value.map((el) => UserModel.fromJson(el)),
    )

    const fetchList = async () => {
        const response = await useFetch(
            "https://jsonplaceholder.typicode.com/users",
        ).then((response) => {
            _list.value.splice(0)
            if (response.status.value === "success") {
                _list.value.push(
                    ...Array.from(
                        response.data.value as Iterable<Record<string, any>>,
                    ).map((el) => UserModel.fromJson(el).toJson()),
                )
            }
        })

        return response
    }

    return { fetchList, list }
})
