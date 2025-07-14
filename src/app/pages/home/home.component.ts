import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
	selector: "app-home",
	imports: [RouterModule],
	template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col items-center justify-center text-white">
      <div class="text-center">
        <h1 class="text-6xl font-bold mb-4">PexNet Hub</h1>
        <p class="text-xl mb-8 opacity-90">Welcome to the PexNet Games Hub</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
            <h2 class="text-2xl font-semibold mb-4">🎯 Wordle Game</h2>
            <p class="mb-4 opacity-80">Test your vocabulary skills with our Wordle implementation</p>
            <a routerLink="/wordle" class="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
              Play Wordle
            </a>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
            <h2 class="text-2xl font-semibold mb-4">🚀 More Games</h2>
            <p class="mb-4 opacity-80">More exciting games coming soon!</p>
            <button disabled class="inline-block bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
	styleUrl: "./home.component.scss",
})
export class HomeComponent {}
