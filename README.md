# JSONata Workflow (jsonata-w)

The **w** stands for **Workflow**. A command-line utility optimized to assist AI agents in transforming and inspecting JSON files, but equally powerful for manual workflows.

## Commands

### Inspect
Inspects the structure of a JSON file.

```bash
jsonata-w inspect <file> [options]
```

#### Options
- `-s, --summary`: Show a high-level summary of the JSON structure (paths and keys).
- `--schema`: Generate and print the JSON schema for the scanned file.
- `-d, --depth <number>`: Limit the depth of inspection (default: 1).
- `--jsonpath <query>`: Filter the input JSON using a JSONPath expression before inspecting.
- `--jsonata <expression>`: Filter the input JSON using a JSONata expression before inspecting.

#### Examples
**Summary view:**
```bash
jsonata-w inspect data.json --summary
```

**Filter with JSONPath:**
```bash
jsonata-w inspect data.json --jsonpath "$.users[*].name"
```

### Transform
Transforms a JSON file using a JSONata expression file. The input and output paths are defined directly within the JSONata file using a standard configuration block.

```bash
jsonata-w transform <file>
```

#### Configuration Block
The JSONata file MUST start with a configuration comment block:

```javascript
/**
 * @config {
 *   "input": "./path/to/input.json",
 *   "output": "./path/to/output.json",
 *   "schema": "./optional/schema.json",
 *   "examples": "./path/to/example.json"
 * }
 */

(
  /* Your JSONata expression here */
  $
)
```

- `input`: Path to the source JSON file (relative to the .jsonata file).
- `output`: Path where the transformed JSON will be saved (relative to the .jsonata file).
- `schema`: (Optional) Path to a JSON schema for validation.
- `examples`: (Optional) Path to a JSON/YAML file containing the expected output subset for validation.

#### Features
- **Embedded Config**: No need for CLI arguments for input/output.
- **Auto-Unflattening**: Results containing dot-notation keys (e.g., `{"a.b": 1}`) are automatically expanded into nested objects (`{"a": {"b": 1}}`). This simplifies generating deep hierarchies.
