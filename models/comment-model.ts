import { DataTypeValidator } from "@/util/data-type-validator"

interface Params {
    id: number
    name: string
    email: string
    body: string
}

export class CommentModel implements Params {
    id: number
    name: string
    email: string
    body: string

    protected constructor(params: Params) {
        this.id = params.id
        this.name = params.name
        this.email = params.email
        this.body = params.body
    }

    public static fromJson(json?: Record<string, any>): CommentModel {
        return new CommentModel({
            id: DataTypeValidator.integer(json?.id),
            name: DataTypeValidator.string(json?.name),
            email: DataTypeValidator.string(json?.email),
            body: DataTypeValidator.string(json?.body),
        })
    }

    public toJson() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            body: this.body,
        }
    }
}
