import { DataTypeValidator } from "@/util/data-type-validator"

interface Params {
    id: number
    userId: number
    title: string
    body: string
}

export class PostModel implements Params {
    id: number
    userId: number
    title: string
    body: string

    protected constructor(params: Params) {
        this.id = params.id
        this.userId = params.userId
        this.title = params.title
        this.body = params.body
    }

    public static fromJson(json?: Record<string, any>): PostModel {
        return new PostModel({
            id: DataTypeValidator.integer(json?.id),
            userId: DataTypeValidator.integer(json?.userId),
            title: DataTypeValidator.string(json?.title),
            body: DataTypeValidator.string(json?.body),
        })
    }

    public toJson() {
        return {
            id: this.id,
            userId: this.userId,
            title: this.title,
            body: this.body,
        }
    }
}
