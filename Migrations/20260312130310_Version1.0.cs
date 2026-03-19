using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaDeDisciplinas.Migrations
{
    /// <inheritdoc />
    public partial class Version10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Subscripion",
                table: "Subject",
                newName: "Subscription");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Duration",
                table: "StudySession",
                type: "TEXT",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "StudySession");

            migrationBuilder.RenameColumn(
                name: "Subscription",
                table: "Subject",
                newName: "Subscripion");
        }
    }
}
