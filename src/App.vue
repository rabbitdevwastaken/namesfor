<template>
  <v-app id="inspire">
    <v-app-bar app color="primary" dark flat>
      <v-container class="pa-0 fill-height">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <!-- <v-avatar class="mr-10" color="white darken-1" size="35"></v-avatar> -->
        <v-btn v-for="link in links" :key="link" :to="link.toLowerCase()" text>
          {{ link }}
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-app-bar v-if="responsive" bottom app color="white" dark class="px-5">
      <v-btn color="success" block light @click="onRandomClick">
        New Random</v-btn
      >
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-virtual-scroll
            :items="animals"
            max-height="100vh"
            item-height="64"
          >
            <template v-slot:default="{ item }">
              <v-list-item :to="item.toLowerCase()" :key="item" link>
                <v-list-item-title> {{ item }} </v-list-item-title>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-container>
              <v-row>
                <h2>{{ this.animal }} Names</h2>
                <v-spacer></v-spacer>
                <v-btn
                  class="px-5"
                  color="red lighten-1"
                  @click="onClearClick"
                  dark
                  >Clear</v-btn
                >
              </v-row>
            </v-container>
          </v-col>
          <v-col v-if="!responsive" cols="2">
            <v-sheet rounded="lg">
              <v-list color="transparent">
                <v-list-item v-for="n in animals" :key="n" link>
                  <v-list-item-content>
                    <v-list-item-title> {{ n }} </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-row>
              <v-col cols="12">
                <v-sheet rounded="lg" class="pa-2">
                  <v-combobox
                    label="Starts with"
                    v-model="start"
                    :items="letters"
                  ></v-combobox>
                  <v-combobox
                    label="Number of letters"
                    v-model="max"
                    :items="numberLetters"
                  ></v-combobox>

                  <v-checkbox label="Male" v-model="male"></v-checkbox>

                  <v-checkbox label="Female" v-model="female"></v-checkbox>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="6">
                <v-sheet
                  v-if="male || (!male && !female)"
                  rounded="lg"
                  class="pa-2"
                >
                  <h2>Male</h2>
                  <v-list color="transparent">
                    <v-list-item v-for="n in list.male" :key="n._id" link>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ n.Name }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-sheet>
              </v-col>

              <v-col cols="12" md="6">
                <v-sheet
                  v-if="female || (!male && !female)"
                  rounded="lg"
                  class="pa-2"
                >
                  <h2>Female</h2>
                  <v-list color="transparent">
                    <v-list-item v-for="n in list.female" :key="n._id" link>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ n.Name }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-sheet>
              </v-col>

              <v-col v-if="!responsive">
                <v-btn color="success" light block @click="onRandomClick">
                  New Random</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { animals } from "./config";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default {
  data: () => ({
    links: ["All", "Male", "Female"],
    drawer: false,
    group: null,
    animal: "",
    animals: animals,
    male: true,
    female: true,
    start: null,
    max: null,
    numberLetters: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    letters: "abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""),
  }),

  computed: {
    ...mapState("layout", ["responsive"]),
    ...mapState("names", ["list"]),

    query() {
      let query = {};

      if (this.start) {
        query.start = this.start;
      }
      if (this.max) {
        query.max = this.max;
      }

      return query;
    },
  },

  watch: {
    group() {
      this.drawer = false;
    },

    query() {
      this.fetchNames();
    },

    animal(val) {
      document.title = `Names for ${val}`;
    },

    $route: {
      immediate: true,
      handler: "onRouteChange",
    },
  },

  created() {
    this.fetchNames();
  },

  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },

  methods: {
    ...mapActions("layout", ["setResponsive", "setCompact"]),
    ...mapActions("names", ["fetchData", "setMale", "setFemale"]),

    async onRandomClick() {
      this.fetchNames();
    },

    onClearClick() {
      this.male = true;
      this.female = true;
      this.start = null;
      this.max = null;
      this.fetchNames();
    },

    onRouteChange(to, from) {
      const animal = capitalizeFirstLetter(to.path.substring(1));
      const index = animals.indexOf(animal);

      if (animal === "All") {
        this.male = true;
        this.female = true;
        this.animal = "";
        return;
      }

      if (animals.indexOf(animal) > -1) {
        this.animal = animal;
        this.fetchNames();
      }

      if (["boy", "male"].indexOf(animal.toLowerCase()) > -1) {
        this.male = true;
        this.female = false;
      }

      if (["girl", "female"].indexOf(animal.toLowerCase()) > -1) {
        this.male = false;
        this.female = true;
      }
    },

    fetchNames() {
      if (this.male) {
        this.fetchData({ gender: "male", ...this.query }).then((data) => {
          if (data.success !== false) {
            this.setMale(data.result);
          }
        });
      }

      if (this.female) {
        this.fetchData({ gender: "female", ...this.query }).then((data) => {
          if (data.success !== false) {
            this.setFemale(data.result);
          }
        });
      }
    },

    onResponsiveInverted() {
      //   EventBus.$emit("resize");
      if (window.innerWidth < 720) {
        this.setResponsive(true);
      } else if (window.innerWidth < 960) {
        this.setCompact(true);
        this.setResponsive(true);
      } else {
        this.setCompact(false);
        this.setResponsive(false);
      }
    },
  },
};
</script>