import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
	selector: "app-wordle-page",
	imports: [RouterModule],
	template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Navigation Header -->
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <a routerLink="/home" class="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                PexNet Hub
              </a>
            </div>
            <nav class="flex space-x-8">
              <a routerLink="/home" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </a>
              <a routerLink="/wordle" class="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Wordle
              </a>
            </nav>
          </div>
        </div>
      </header>

      <!-- Wordle Game Content -->
      <main class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">PexNet Wordle</h1>
          <p class="text-gray-600">Guess the word in 6 tries!</p>
        </div>

        <!-- Integration Message -->
        <div class="bg-white rounded-lg shadow p-8 text-center">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Wordle Game Integration</h2>
            <p class="text-gray-600 mb-6">
              The Wordle game has been successfully added as a submodule!
              To run the Wordle game independently, use the following commands:
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p class="font-mono text-sm text-gray-800 mb-2">
              <strong>To serve the Wordle game:</strong>
            </p>
            <code class="block bg-gray-800 text-green-400 p-3 rounded">
              npm run start:wordle
            </code>
            <p class="text-sm text-gray-600 mt-2">
              This will start the Wordle game at <code>http://localhost:4200</code>
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold text-blue-800 mb-2">Available Commands</h3>
              <ul class="space-y-1 text-left">
                <li><code>npm run start:wordle</code> - Serve Wordle</li>
                <li><code>npm run build:wordle</code> - Build Wordle</li>
                <li><code>npm run test:wordle</code> - Test Wordle</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold text-green-800 mb-2">Project Structure</h3>
              <ul class="space-y-1 text-left">
                <li><code>projects/pexnet-wordle/</code> - Wordle source</li>
                <li><code>.gitmodules</code> - Submodule config</li>
                <li><code>angular.json</code> - Workspace config</li>
              </ul>
            </div>
          </div>

          <div class="mt-6">
            <a
              href="http://localhost:4201"
              target="_blank"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Open Wordle Game (Port 4201)
            </a>
            <p class="text-sm text-gray-500 mt-2">
              Make sure to run <code>npm run start:wordle</code> first
            </p>
          </div>
        </div>
      </main>
    </div>
  `,
	styleUrl: "./wordle-page.component.scss",
})
export class WordlePageComponent {}
