---
to: _templates/<%= name %>/<%= action || 'new' %>/<%= name %>.ejs.t
---
---
to: src/<%= name %>/<%= name %>.ts
---
const hello = ```
Hello!
This is your first prompt based hygen template.

Learn what it can do here:

https://github.com/jondot/hygen
```

console.log(hello)


