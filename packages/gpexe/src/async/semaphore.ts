export function Semaphore(max: number): {
  acquire: VoidFunction
  release: VoidFunction
  purge: () => number
} {
  var counter = 0
  var waiting: { resolve: Function; err: Function }[] = []

  var take = function () {
    if (waiting.length > 0 && counter < max) {
      counter++
      let promise = waiting.shift()
      promise?.resolve()
    }
  }

  return {
    acquire: function (): Promise<any> {
      if (counter < max) {
        counter++
        return new Promise((resolve: any) => {
          resolve()
        })
      } else {
        return new Promise((resolve, err) => {
          waiting.push({ resolve: resolve, err: err })
        })
      }
    },

    release: function () {
      counter--
      take()
    },

    purge: function (): number {
      let unresolved = waiting.length

      for (let i = 0; i < unresolved; i++) {
        waiting[i]?.err('Task has been purged.')
      }

      counter = 0
      waiting = []

      return unresolved
    },
  }
}
