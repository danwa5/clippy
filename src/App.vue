<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#">clippy</b-navbar-brand>
      </b-navbar>
    </div>
    <b-container fluid>
      <b-row class="pt-2">
        <b-col md="4" lg="4" class="p-3">
          <div class="mb-2">
            <b-button size="sm" v-on:click="copy('input')">
              <b-icon-files></b-icon-files> Copy
            </b-button>

            <b-button size="sm" v-on:click="reset()" variant="danger" class="ml-2">
              <b-icon-x-circle></b-icon-x-circle> Reset
            </b-button>
          </div>
          <b-form-textarea
            id="input"
            v-model="input"
            v-on:input="countInputItems"
            rows="24"
            placeholder="Enter a list of items (e.g. column of Google Spreadsheet or Sequel Pro query results)"
            no-resize
          />
          <div class="pt-2">
            Item Count: <span class="inputItemCount"><strong>{{this.inputItemCount}}</strong></span>
          </div>
        </b-col>
        <b-col md="3" lg="2" class="p-3">
          <div class="mt-5">
            <b-button block v-on:click="transform" variant="info" type="button">Transform</b-button>

            <div class="mt-4">
              <strong>Delimiter</strong>
              <b-form-select id="delimiter" v-model="selectedDelimiter" :options="delimiterOptions" size="sm" class="my-1"></b-form-select>
              <b-form-input id="customDelimiter" v-model="customDelimiter" :formatter="formatDelimiter" placeholder="Custom Delimiter" size="sm" class="my-1"></b-form-input>
            </div>
            <div class="mt-4">
              <strong>Options</strong>
              <b-form-checkbox id="removeBlanks" v-model="removeBlanks" class="py-1">Remove blanks</b-form-checkbox>
              <b-form-checkbox id="removeDuplicates" v-model="removeDuplicates" class="py-1">Remove duplicates</b-form-checkbox>
              <b-form-checkbox id="encloseInQuotes" v-model="encloseInQuotes" class="py-1">Enclose in quotes</b-form-checkbox>
            </div>
          </div>
        </b-col>
        <b-col md="5" lg="6" class="p-3">
          <div class="mb-2">
            <b-tabs class="mt-1">
              <b-tab :title="resultsTabTitle" v-on:click="toggleCopyElement('results')" active>
                <b-card-text>
                  <b-form-textarea
                    id="results"
                    class="mt-1"
                    v-model="results"
                    rows="24"
                    no-resize
                  />
                </b-card-text>
              </b-tab>

              <b-tab :title="duplicatesTabTitle" v-bind:disabled="isDuplicatesDisabled" v-on:click="toggleCopyElement('duplicates')">
                <b-card-text>
                  <b-form-textarea
                    id="duplicates"
                    class="mt-1"
                    v-model="duplicates"
                    rows="24"
                    no-resize
                  />
                </b-card-text>
              </b-tab>

              <template #tabs-end>
                <li role="presentation" class="nav-item ml-auto">
                  <b-button size="sm" v-on:click="copy(copyElementId)">
                    <b-icon-files></b-icon-files> Copy {{copyElementId.charAt(0).toUpperCase() + copyElementId.slice(1)}}
                  </b-button>
                </li>
              </template>
            </b-tabs>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: function() {
    return {
      copyElementId: 'results',
      input: '',
      inputItemCount: 0,
      results: '',
      resultsItemCount: 0,
      resultsTabTitle: 'Results',
      duplicates: '',
      duplicatesItemCount: 0,
      duplicatesTabTitle: 'Duplicates',
      isDuplicatesDisabled: true,
      customDelimiter: '',
      selectedDelimiter: 'comma',
      delimiterOptions: [
        { value: 'comma', text: 'comma (default)' },
        { value: 'newline', text: 'newline' },
        { value: 'space', text: 'space' },
        { value: 'tab', text: 'tab' }
      ],
      removeBlanks: true,
      removeDuplicates: true,
      encloseInQuotes: false
    };
  },
  methods: {
    addQuotesToItemsInCollection: function(collection, delimiter) {
      let items = collection.split(delimiter);

      if (items.length === 1 && items.includes('')) {
        return collection;
      } else {
        return items.map(item => `'${item}'`).join(delimiter);
      }
    },

    copy: function(elementId) {
      let copyText = document.getElementById(elementId);
      copyText.select();
      copyText.setSelectionRange(0, 99999); // for mobile devices
      document.execCommand("copy");
    },

    countInputItems: function() {
      this.inputItemCount = this.countItems(this.input, '\n');
    },

    countItems: function(input, delimiter) {
      let regex = new RegExp(delimiter, 'g');
      return input.length == 0 ? 0 : (input.match(regex) || []).length + 1;
    },

    formatDelimiter: function(e) {
      return String(e).substring(0,2);
    },

    identifyDelimiter: function() {
      const delimiters = {
        'comma': ',',
        'newline': '\n',
        'space': ' ',
        'tab': '\t'
      }

      var customDelimiter = this.customDelimiter.slice(0,2);
      return customDelimiter || delimiters[this.selectedDelimiter];
    },

    identifyDuplicates: function(items) {
      // find duplicate items. if none, default to []
      return items.reduce((acc, val, index, items) => {
        if (items.indexOf(val) !== index && acc.indexOf(val) < 0) {
          acc.push(val);
        }
        return acc;
      }, []);
    },

    removeBlanksFromCollection: function(collection, delimiter) {
      let items = collection.split(delimiter);
      return items.filter(item => item.trim().length > 0).join(delimiter);
    },

    reset: function() {
      Object.assign(this.$data, this.$options.data.apply(this));
    },

    toggleCopyElement: function(targetElementId) {
      if (this.copyElementId !== targetElementId) {
        this.copyElementId = targetElementId;
      }
    },

    transform: function() {
      let inputValue = this.input;

      if (inputValue !== undefined) {
        const delimiter = this.identifyDelimiter();

        // no need to replace delimiter if it hasn't changed
        var transformed = delimiter === '\n' ? inputValue : inputValue.replace(/\n/g, delimiter);
        var dupes = '';

        if (this.removeDuplicates === true) {
          let items = transformed.split(delimiter);
          const uniqueSet = new Set(items);
          transformed = [...uniqueSet].join(delimiter);
          dupes = this.identifyDuplicates(items).join(delimiter);
        }

        if (this.removeBlanks === true) {
          transformed = this.removeBlanksFromCollection(transformed, delimiter);
          dupes       = this.removeBlanksFromCollection(dupes, delimiter);
        }

        if (this.encloseInQuotes === true) {
          transformed = this.addQuotesToItemsInCollection(transformed, delimiter);
          dupes       = this.addQuotesToItemsInCollection(dupes, delimiter);
        }

        this.results = transformed;
        this.resultsItemCount = this.countItems(transformed, delimiter);
        this.resultsTabTitle = 'Results (' + this.resultsItemCount + ')';
        this.duplicates = dupes;
        this.duplicatesItemCount = this.countItems(dupes, delimiter);
        this.duplicatesTabTitle = 'Duplicates (' + this.duplicatesItemCount + ')';
        this.isDuplicatesDisabled = dupes.length === 0;
      }
    }
  }
}
</script>
