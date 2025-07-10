# 📘 What is Dapper?

Dapper is a **micro ORM (Object-Relational Mapper)** developed by StackOverflow that focuses on **performance and simplicity**.  
Unlike Entity Framework:
- ❌ It doesn’t track entities
- ❌ It doesn’t manage object graphs
- ✅ It provides a thin abstraction over raw ADO.NET

---

# 🧰 Prerequisites

- ✅ Basic knowledge of **C#** and **ASP.NET Core**
- ✅ **SQL Server** (or any RDBMS supported by ADO.NET)
- ✅ **.NET SDK** installed

---

# ✅ 1. Querying Data

| Method                          | Description                                                   |
|---------------------------------|---------------------------------------------------------------|
| `Query<T>(sql, params)`         | Returns an `IEnumerable<T>` (sync version).                  |
| `QueryAsync<T>(sql, params)`    | Async version of `Query`.                                   |
| `QueryFirst<T>(sql, params)`    | Returns the first row; **throws** if none found.            |
| `QueryFirstOrDefault<T>(...)`   | Returns the first row; returns **null** if none found.      |
| `QueryFirstOrDefaultAsync<T>`   | Async version of the above.                                 |
| `QuerySingle<T>(sql, params)`   | Expects **exactly one row**; throws if 0 or >1 rows.        |
| `QuerySingleOrDefault<T>(...)`  | Like above, but returns **null** if none.                   |
| `QueryMultipleAsync(...)`       | Reads **multiple result sets** using `.Read<T>()`.          |

---

# ✅ 2. Executing Commands

| Method                           | Description                                                       |
|----------------------------------|-------------------------------------------------------------------|
| `Execute(sql, params)`           | Executes an `INSERT`, `UPDATE`, or `DELETE`. Returns rows affected. |
| `ExecuteAsync(sql, params)`      | Async version of `Execute`.                                       |
| `ExecuteScalar<T>(sql, params)`  | Returns a single value (e.g., count, ID).                         |
| `ExecuteScalarAsync<T>(...)`     | Async version of `ExecuteScalar`.                                 |

---

# ✅ 3. Stored Procedures

Set `commandType` to `CommandType.StoredProcedure`:

```csharp
await _db.QueryAsync<Student>(
    "sp_GetStudents",
    commandType: CommandType.StoredProcedure
);
```

---

# ✅ 4. Transactions

```csharp
using var transaction = _db.BeginTransaction();

await _db.ExecuteAsync("INSERT INTO Students ...", studentObj, transaction);
await _db.ExecuteAsync("INSERT INTO Courses ...", courseObj, transaction);

transaction.Commit();
```

---

# ✅ 5. Joins and Multi-Mapping

```csharp
var sql = @"SELECT * FROM Students s JOIN Courses c ON s.CourseId = c.Id";

var result = await _db.QueryAsync<Student, Course, Student>(
    sql,
    (student, course) => {
        student.Course = course;
        return student;
    },
    splitOn: "Id"
);
```

---

# ✅ 6. QueryMultiple (Multiple Result Sets)

```csharp
using var multi = await _db.QueryMultipleAsync(@"
    SELECT * FROM Students;
    SELECT * FROM Teachers;
");

var students = multi.Read<Student>().ToList();
var teachers = multi.Read<Teacher>().ToList();
```

---

# ✅ 7. Dynamic Querying

```csharp
var result = await _db.QueryAsync("SELECT * FROM Students");

foreach (var row in result)
{
    Console.WriteLine(row.Name); // row is dynamic
}
```

---

# ⚙️ Common Parameters

| Parameter         | Description                                                  |
|-------------------|--------------------------------------------------------------|
| `sql`             | The raw SQL string or stored procedure name                  |
| `param`           | Anonymous object or `DynamicParameters`                      |
| `transaction`     | Optional `IDbTransaction` instance                           |
| `commandTimeout`  | Optional command timeout (in seconds)                        |
| `commandType`     | `CommandType.Text` (default) or `CommandType.StoredProcedure`|

---

# 📌 Example

```csharp
var student = await _db.QueryFirstOrDefaultAsync<Student>(
    "SELECT * FROM Students WHERE Id = @Id",
    new { Id = 5 }
);
```

---
# Uses
# 📚 Dapper SQL Command Reference

This cheat sheet shows which Dapper method to use for common SQL operations like SELECT, INSERT, UPDATE, DELETE, TRUNCATE, and ALTER.

---

## 🔄 Dapper Methods by SQL Command

| SQL Command     | Dapper Method                                  | Return Type           | Description                                               |
|------------------|-----------------------------------------------|------------------------|-----------------------------------------------------------|
| `SELECT`         | `Query<T>()`, `QueryAsync<T>()`               | `IEnumerable<T>`       | Multiple rows                                              |
|                  | `QueryFirstOrDefault<T>()`, `QueryFirstOrDefaultAsync<T>()` | `T` or `null`     | First row or null                                          |
|                  | `QuerySingle<T>()`, `QuerySingleOrDefault<T>()`           | `T` or `null`     | Exactly one row (throws if not exactly 1)                 |
| `INSERT`         | `Execute()`, `ExecuteAsync()`                 | `int` (rows affected)  | Insert a record                                            |
|                  | `ExecuteScalar<T>()`, `ExecuteScalarAsync<T>()` | `T` (e.g., int ID)   | Returns single value (e.g., new ID)                       |
| `UPDATE`         | `Execute()`, `ExecuteAsync()`                 | `int`                 | Update record(s)                                           |
| `DELETE`         | `Execute()`, `ExecuteAsync()`                 | `int`                 | Delete record(s)                                           |
| `TRUNCATE TABLE` | `Execute()`, `ExecuteAsync()`                 | `int`                 | Deletes all rows (no WHERE clause)                         |
| `ALTER TABLE`    | `Execute()`, `ExecuteAsync()`                 | `int`                 | Schema changes (add/modify columns)                        |

---

## 💡 Examples

### 🔍 SELECT
```csharp
var students = await _db.QueryAsync<Student>("SELECT * FROM Students");
```

### ✏️ UPDATE
```csharp
await _db.ExecuteAsync(
    "UPDATE Students SET Name = @Name WHERE Id = @Id",
    new { Name = "John Doe", Id = 1 }
);
```

### ❌ DELETE
```csharp
await _db.ExecuteAsync("DELETE FROM Students WHERE Id = @Id", new { Id = 1 });
```

### ⚠️ TRUNCATE
```csharp
await _db.ExecuteAsync("TRUNCATE TABLE Students");
```

### ⚙️ ALTER TABLE
```csharp
await _db.ExecuteAsync("ALTER TABLE Students ADD Age INT");
```

### ➕ INSERT + Return ID
```csharp
var id = await _db.ExecuteScalarAsync<int>(
    "INSERT INTO Students (Name, Email) VALUES (@Name, @Email); SELECT SCOPE_IDENTITY();",
    new { Name = "Nishan", Email = "nishan@example.com" }
);
```

---
