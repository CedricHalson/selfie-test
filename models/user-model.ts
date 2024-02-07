import { DataTypeValidator } from "@/util/data-type-validator"

interface Params {
    id: number
    name: string
    username: string
    email: string
}

export class UserModel implements Params {
    id: number
    name: string
    username: string
    email: string

    protected constructor(params: Params) {
        this.id = params.id
        this.name = params.name
        this.username = params.username
        this.email = params.email
    }

    public static fromJson(json?: Record<string, any>): UserModel {
        return new UserModel({
            id: DataTypeValidator.integer(json?.id),
            name: DataTypeValidator.string(json?.name),
            username: DataTypeValidator.string(json?.username),
            email: DataTypeValidator.string(json?.email),
        })
    }

    public toJson() {
        return {
            id: this.id,
            name: this.name,
            username: this.username,
            email: this.email,
        }
    }
}
