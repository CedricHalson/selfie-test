<template>
    <nuxt-layout>
        <q-layout view="hHh lpR fFf">
            <q-header
                bordered
                class="bg-primary text-white"
            >
                <q-toolbar>
                    <q-toolbar-title>
                        <q-avatar>
                            <img
                                src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"
                            />
                        </q-avatar>
                        <nuxt-link
                            class="header-title"
                            to="/"
                        >
                            Selfie Test Demo Blog
                        </nuxt-link>
                    </q-toolbar-title>
                </q-toolbar>
            </q-header>

            <q-page-container>
                <nuxt-page />
            </q-page-container>

            <q-footer
                bordered
                class="bg-grey-8 text-white"
            >
                <q-toolbar>Selfie Test </q-toolbar>
            </q-footer>
        </q-layout>
    </nuxt-layout>
</template>

<script setup lang="ts"></script>

<style lang="sass">
.link
    color: var(--q-positive)
    text-decoration: none

    &:hover
        text-decoration: underline

.header-title
    margin-left: 16px
    color: white
    text-decoration: none
</style>
