# JSONata Workflow (jsonata-w)

The **w** stands for **Workflow**. A command-line utility optimized to assist AI agents in transforming and inspecting JSON/YAML files, but equally powerful for manual workflows.

## Commands

### Inspect
Inspects the structure of a JSON or YAML file.

```bash
jsonata-w inspect <file> [options]
```

#### Options
- `-s, --summary`: Show a high-level summary of the structure (paths and keys).
- `--schema`: Generate and print the JSON schema for the scanned file.
- `-d, --depth <number>`: Limit the depth of inspection (default: 1).
- `--jsonpath <query>`: Filter the input using a JSONPath expression before inspecting.
- `--jsonata <expression>`: Filter the input using a JSONata expression before inspecting.

#### Examples
**Summary view (JSON):**
```bash
jsonata-w inspect data.json --summary
```

**Summary view (YAML):**
```bash
jsonata-w inspect tokens.yml --summary
```

**Filter with JSONPath:**
```bash
jsonata-w inspect data.json --jsonpath "$.users[*].name"
```

### Transform
Transforms a JSON or YAML file using a JSONata expression file. The input and output paths are defined directly within the JSONata file using a standard configuration block.

```bash
jsonata-w transform <file>
```

#### Configuration Block
The JSONata file MUST start with a configuration comment block:

```javascript
/**
 * @config {
 *   "input": "./path/to/input.yml",
 *   "output": "./path/to/output.json",
 *   "schema": "./optional/schema.yml",
 *   "examples": "./path/to/example.yml"
 * }
 */

(
  /* Your JSONata expression here */
  $
)
```

- `input`: Path to the source file — supports `.json`, `.yml`, `.yaml` (relative to the .jsonata file).
- `output`: Path where the result will be saved — format is auto-detected from extension:
  - `.json` → JSON output
  - `.yml` / `.yaml` → YAML output
  - other → raw string output
- `schema`: (Optional) Path to a JSON or YAML schema for validation.
- `examples`: (Optional) Path to a JSON or YAML file containing the expected output subset for validation.

#### Features
- **YAML Support**: Full YAML support for input, output, schema, and example files. File format is detected from the extension (`.yml`/`.yaml` = YAML, everything else = JSON).
- **Embedded Config**: No need for CLI arguments for input/output.
- **Auto-Unflattening**: Results containing dot-notation keys (e.g., `{"a.b": 1}`) are automatically expanded into nested objects (`{"a": {"b": 1}}`). This simplifies generating deep hierarchies.
